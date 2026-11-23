import sys
from PIL import Image
import numpy as np
INK=np.array([36,24,30])
def pixelize(path, th=64, colors=24):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(int)
    r,g,b=a[...,0],a[...,1],a[...,2]
    from PIL import ImageDraw
    t=im.copy()
    for pt in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1),(im.width//2,0),(im.width//2,im.height-1),(0,im.height//2),(im.width-1,im.height//2)]:
        ImageDraw.floodfill(t,pt,(0,255,0),thresh=55)
    ta=np.asarray(t).astype(int); fg=~((ta[...,0]==0)&(ta[...,1]==255)&(ta[...,2]==0))
    yy=np.arange(a.shape[0])[:,None]; pinkish=(r>g+45)&(b>g+25)&(np.abs(r-b)<90)
    fg&=~(pinkish&(yy>a.shape[0]*0.82))
    ys,xs=np.where(fg); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    a2=a.copy()
    crop=Image.fromarray(a2[y0:y1+1,x0:x1+1].astype('uint8')); mk=fg[y0:y1+1,x0:x1+1]
    h=th; w=max(1,round(crop.width*h/crop.height))
    # media solo de píxeles del personaje
    num=np.asarray(crop).astype(float)*mk[...,None]
    S=lambda arr: np.asarray(Image.fromarray(arr.astype('float32')).resize((w,h),Image.BOX)) if arr.ndim==2 else None
    m=np.asarray(Image.fromarray((mk*255).astype('uint8')).resize((w,h),Image.BOX)).astype(float)/255
    ch=[np.asarray(Image.fromarray(num[...,k].astype('float32'),'F').resize((w,h),Image.BOX)) for k in range(3)]
    col=np.stack(ch,-1)/np.maximum(m[...,None],1e-3)
    alpha=m>0.45
    fill=col.copy(); fill[~alpha]=col[alpha].mean(0)
    q=Image.fromarray(np.clip(fill,0,255).astype('uint8')).quantize(colors=colors,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    qa=np.asarray(q).astype(int)
    # contorno: píxel opaco que toca transparente -> oscurecido
    out=np.zeros((h,w,4),dtype=np.uint8); out[...,:3]=qa; out[...,3]=alpha*255
    pad=np.pad(alpha,1)
    edge=alpha&~(pad[:-2,1:-1]&pad[2:,1:-1]&pad[1:-1,:-2]&pad[1:-1,2:])
    dark=(qa*0.3+INK*0.7).astype(int)
    lum=qa.sum(2)
    out[...,:3]=np.where((edge&(lum>150))[...,None],dark,qa)
    return Image.fromarray(out,'RGBA')
out=sys.argv[1]; th=int(sys.argv[2]); paths=sys.argv[3:]
ims=[pixelize(p,th) for p in paths]
pad=4; W=sum(i.width for i in ims)+pad*(len(ims)+1); H=th+pad*2
c=Image.new('RGBA',(W,H),(240,234,222,255)); x=pad
for i in ims: c.alpha_composite(i,(x,pad)); x+=i.width+pad
s=max(1,640//H); c.resize((W*s,H*s),Image.NEAREST).save(out)
