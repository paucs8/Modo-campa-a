# Extrae capas pixeladas alineadas a partir del maniquí y de las versiones con inpainting
import sys, json, glob, os
from PIL import Image, ImageDraw
import numpy as np
SRC='/mnt/user-data/uploads/output/modocampana'
OUT=sys.argv[1] if len(sys.argv)>1 else '/tmp/claude-0/-home-claude/b459d7ae-9c62-5154-9a1d-4af3d459061c/scratchpad/parts'
BASE=SRC+'/char_00035_.png'
GH=72                                   # alto de la cuadrícula final
BOX=(95,20,745,1196)                    # caja de recorte fija (deja margen para pelo y ropa ancha)
def key(a):
    r,g,b=a[...,0],a[...,1],a[...,2]
    return ~((b>g+25)&(r>g+35))
def grid(path):
    a=np.asarray(Image.open(path).convert('RGB').crop(BOX)).astype(float)
    fg=key(a.astype(int)).astype(float)
    h=GH; w=round((BOX[2]-BOX[0])*GH/(BOX[3]-BOX[1]))
    rs=lambda arr: np.asarray(Image.fromarray(arr.astype('float32'),'F').resize((w,h),Image.BOX))
    al=rs(fg); col=np.stack([rs(a[...,k]*fg) for k in range(3)],-1)/np.maximum(al[...,None],1e-3)
    return col, al>0.5
def masks():
    def mk(draw):
        im=Image.new('L',(832,1216),0); d=ImageDraw.Draw(im); draw(d); return im
    E=lambda d,cx,cy,rx,ry,f=255: d.ellipse((cx-rx,cy-ry,cx+rx,cy+ry),fill=f)
    def face(d): E(d,420,415,150,92,0)
    def hs(d): E(d,420,260,300,230); d.rectangle((150,250,690,480),fill=255); face(d)
    def hl(d): E(d,420,260,300,230); d.rectangle((130,250,710,810),fill=255); face(d); d.rectangle((290,505,550,825),fill=0)
    def hat(d): E(d,420,200,320,190); d.rectangle((0,330,832,1216),fill=0)
    M={'m_hair_short.png':mk(hs),'m_hair_long.png':mk(hl),'m_hat.png':mk(hat),
       'm_top.png':mk(lambda d:d.rectangle((140,510,700,910),fill=255)),
       'm_bottom.png':mk(lambda d:d.rectangle((210,840,630,1110),fill=255)),
       'm_bottom2.png':mk(lambda d:d.rectangle((200,775,640,1115),fill=255)),
       'm_glasses.png':mk(lambda d:E(d,420,385,175,62)),
       'm_shoes.png':mk(lambda d:d.rectangle((220,1060,620,1200),fill=255))}
    out={}
    for k,m in M.items():
        m=m.crop(BOX); w=round((BOX[2]-BOX[0])*GH/(BOX[3]-BOX[1]))
        out[k]=np.asarray(m.resize((w,GH),Image.BOX))>100
    return out
if __name__=='__main__':
    jobs=json.load(open(OUT+'/jobs.json'))   # [[nombre, mascara, archivo]]
    bcol,bal=grid(BASE); MS=masks()
    np.save(OUT+'/base_col.npy',bcol); np.save(OUT+'/base_al.npy',bal)
    for name,mask,f in jobs:
        col,al=grid(f); m=MS[mask]
        diff=np.abs(col-bcol).sum(-1)
        r,g,b=col[...,0],col[...,1],col[...,2]
        skin=(r>g+18)&(r>b+35)&(r>150)
        lay=al&m&((~bal)|(diff>40))&~skin
        np.save(OUT+f'/{name}_col.npy',col); np.save(OUT+f'/{name}_al.npy',lay)
    print('ok', bcol.shape)
