import sys, json
import numpy as np
from PIL import Image
D='/tmp/claude-0/-home-claude/b459d7ae-9c62-5154-9a1d-4af3d459061c/scratchpad/parts'
INK=np.array([40,26,34.])
hexc=lambda h: np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
LREF={'hair':0.72,'hat':0.92,'top':0.92,'bottom':0.92,'shoes':0.92}
def recolor(col, slot, target):
    L=(col@np.array([.299,.587,.114]))/255
    t=np.clip(L/LREF[slot],0,1.25)
    cool=np.array([70,60,130.])
    base=target*np.minimum(t,1)[...,None]
    shade=(1-np.minimum(t,1))[...,None]
    out=base*(1-shade*0.25)+cool*shade*0.25*np.minimum(t,1)[...,None]
    out=out+ (255-out)*np.clip(t-1,0,0.15)[...,None]*(target.mean()/255)
    out=np.where((L<0.28)[...,None], target*0.25+INK*0.75*1.0, out)
    return np.clip(out,0,255)
def compose(spec):
    col=np.load(D+'/base_col.npy').copy(); al=np.load(D+'/base_al.npy').copy()
    for slot in ['shoes','bottom','top','hair','glasses','hat']:
        if slot not in spec: continue
        name,color=spec[slot]
        c=np.load(D+f'/{slot}_{name}_col.npy'); a=np.load(D+f'/{slot}_{name}_al.npy')
        rc=c if slot=='glasses' or color is None else recolor(c,slot,hexc(color))
        col[a]=rc[a]; al|=a
    hgt=spec.get('height','medio')
    rows=list(range(col.shape[0]))
    if hgt=='bajo': rows=[r for r in rows if r not in (44,58,62)]
    if hgt=='alto': rows=sorted(rows+[44,57,61])
    col=col[rows]; al=al[rows]
    # contorno exterior
    pad=np.pad(al,1); edge=al&~(pad[:-2,1:-1]&pad[2:,1:-1]&pad[1:-1,:-2]&pad[1:-1,2:])
    lum=col.sum(-1)
    col=np.where((edge&(lum>200))[...,None], col*0.3+INK*0.7, col)
    img=np.zeros(col.shape[:2]+(4,),np.uint8); img[...,:3]=np.clip(col,0,255); img[...,3]=al*255
    im=Image.fromarray(img,'RGBA')
    q=im.convert('RGB').quantize(28,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGBA'); q.putalpha(im.getchannel('A'))
    return q
if __name__=='__main__':
    specs=json.load(open(sys.argv[1])); out=sys.argv[2]
    ims=[compose(s) for s in specs]; w=ims[0].size[0]; h=max(i.size[1] for i in ims)
    c=Image.new('RGBA',(w*len(ims),h),(240,234,222,255))
    for k,i in enumerate(ims): c.alpha_composite(i,(k*w,h-i.size[1]))
    s=max(1,700//h); c.resize((c.width*s,c.height*s),Image.NEAREST).save(out)
