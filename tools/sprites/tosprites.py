# Convierte las capas de IA en sprites de índices limpios (paleta exacta, contorno por capa)
import json, glob, os
import numpy as np
D='/tmp/claude-0/-home-claude/b459d7ae-9c62-5154-9a1d-4af3d459061c/scratchpad/parts'
N4=[(1,0),(-1,0),(0,1),(0,-1)]
def isskin(c):
    r,g,b=c[...,0],c[...,1],c[...,2]
    return (r>g+18)&(r>b+35)&(r>150)&(b<g-4)
def convert(col, R, kind):
    h,w=R.shape; L=col.mean(-1); sk=isskin(col)&R
    out=np.full((h,w),'.',dtype='<U1')
    inR=lambda y,x: 0<=y<h and 0<=x<w and R[y,x]
    # piel en 4 tonos fijos según la piel del maniquí
    bcol=np.load(D+'/base_col.npy'); bal=np.load(D+'/base_al.npy'); bsk=isskin(bcol)&bal; bL=bcol.mean(-1)[bsk]
    q=np.percentile(bL,[10,30,85])
    dark=R&(L<95)&~sk
    for y in range(h):
        for x in range(w):
            if not R[y,x]: continue
            if sk[y,x]:
                out[y,x]='p'
                c=col[y,x]
                if kind=='base' and 0.25*h<=y<=0.34*h and c[0]-c[1]>48 and L[y,x]>150: out[y,x]='k'
            elif dark[y,x]:
                n=sum(1 for dy,dx in N4 if 0<=y+dy<h and 0<=x+dx<w and dark[y+dy,x+dx])
                out[y,x]='a' if n>=3 else 'o'
    main=R&~sk&~dark
    if main.any():
        M=np.median(L[main])
        for y,x in zip(*np.where(main)):
            v=L[y,x]; out[y,x]='1' if v>M+20 else ('4' if v<M-55 else ('3' if v<M-16 else '2'))
    # piel: sombreado procedural (luz arriba a la izquierda)
    skm=(out=='p')
    runm=skm|(dark&(np.arange(h)[:,None]<0.4*h))|(np.isin(out,['k']))
    def run(y,x,dy,dx):
        n=0
        while 0<=y+dy*(n+1)<h and 0<=x+dx*(n+1)<w and runm[y+dy*(n+1),x+dx*(n+1)]: n+=1
        return n
    for y,x in zip(*np.where(skm)):
        l,r_,t,d=run(y,x,0,-1),run(y,x,0,1),run(y,x,-1,0),run(y,x,1,0)
        wd=l+r_+1; rx=l/(wd-1) if wd>1 else .5
        tone='p'
        if rx>0.86 or d==0: tone='q'
        if (rx>0.97 and wd>6) or (d==0 and rx>0.7): tone='r'
        if rx<0.22 and t<4 and wd>4: tone='s'
        out[y,x]=tone
    # limpiar píxeles sueltos de tono
    for _ in range(3):
        o2=out.copy()
        for y in range(h):
            for x in range(w):
                c=out[y,x]
                if c not in '1234': continue
                N8=N4+[(1,1),(1,-1),(-1,1),(-1,-1)]
                nb=[out[y+dy,x+dx] for dy,dx in N8 if 0<=y+dy<h and 0<=x+dx<w and out[y+dy,x+dx] in '1234']
                if len(nb)>=5 and nb.count(c)<=1:
                    o2[y,x]=max(set(nb),key=nb.count)
        out=o2
    # contorno en el borde de cada capa
    for y in range(h):
        for x in range(w):
            if out[y,x]=='.' : continue
            if any(not inR(y+dy,x+dx) for dy,dx in N4):
                out[y,x]='o' if out[y,x] not in 'spqrk' else 'O'   # O = contorno de piel
    # brillo: base que toca contorno por arriba, en la mitad izquierda de la pieza
    xs=np.where(R.any(0))[0]
    if len(xs):
        mid=xs.min()+(xs.max()-xs.min())*0.45
        for y in range(1,h):
            for x in range(w):
                if out[y,x]=='2' and out[y-1,x] in 'oO.' and x<mid: out[y,x]='1'
    return out
def prune(out, minsize=8):
    h,w=out.shape; seen=np.zeros((h,w),bool)
    for y in range(h):
        for x in range(w):
            if out[y,x]=='.' or seen[y,x]: continue
            st=[(y,x)]; comp=[]; seen[y,x]=True
            while st:
                a,b=st.pop(); comp.append((a,b))
                for dy,dx in N4:
                    c,d=a+dy,b+dx
                    if 0<=c<h and 0<=d<w and not seen[c,d] and out[c,d]!='.': seen[c,d]=True; st.append((c,d))
            if len(comp)<minsize:
                for a,b in comp: out[a,b]='.'
    return out
def crop(out):
    ys,xs=np.where(out!='.')
    if not len(ys): return None
    y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    return {'x':int(x0),'y':int(y0),'rows':[''.join(r[x0:x1+1]) for r in out[y0:y1+1]]}
S={}
bcol=np.load(D+'/base_col.npy'); bal=np.load(D+'/base_al.npy')
base=convert(bcol,bal,'base')
# ropa interior del maniquí -> tonos u/v/w
bL=bcol.mean(-1)
for y,x in zip(*np.where(np.isin(base,list('1234')))):
    base[y,x]={'1':'u','2':'u','3':'v','4':'w'}[base[y,x]]
# brillos de los ojos: tonos claros dentro de la cabeza -> blanco
GH=base.shape[0]; W_=base.shape[1]
for y,x in zip(*np.where(np.isin(base,list('uvw')))):
    if y < 0.42*GH:
        near=any(base[y+dy,x+dx]=='a' for dy in (-2,-1,0,1,2) for dx in (-2,-1,0,1,2) if 0<=y+dy<GH and 0<=x+dx<W_)
        base[y,x]='E' if (0.25*GH<=y<=0.36*GH and near) else 'p'
# rosa de las orejas fuera de la cara -> piel en sombra
cols=np.where((base!='.').any(0))[0]; cx=(cols.min()+cols.max())/2; half=(cols.max()-cols.min())/2
for y,x in zip(*np.where(base=='k')):
    if abs(x-cx)>half*0.78: base[y,x]='q'
# manos: piel del maniquí por debajo de la cintura, a los lados (se pintan encima de la ropa)
hands=np.full(base.shape,'.',dtype='<U1')
for y,x in zip(*np.where(base!='.')):
    if y>=round(44*GH/72) and y<=round(52*GH/72) and (x<=round(12*W_/40) or x>=round(27*W_/40)) and base[y,x] in 'spqrkoO': hands[y,x]=base[y,x]
S['hands']=crop(hands)
S['base']=crop(base)
for f in sorted(glob.glob(D+'/*_al.npy')):
    n=os.path.basename(f)[:-7]
    if n=='base': continue
    al=np.load(f); col=np.load(D+f'/{n}_col.npy')
    if n.split('_')[0] in ('hair','hat','glasses'):
        skn=isskin(col)
        if n.startswith('hair_'):
            hole=al&skn&~bal            # huecos fuera de la cara del maniquí -> pelo en sombra
            hairpx=al&~skn&(col.mean(-1)>95)
            if hairpx.any():
                med=np.median(col[hairpx],axis=0); col=col.copy(); col[hole]=med*0.86
            al=(al&~skn)|hole
        else:
            al=al&~skn
    else:
        al=al&~isskin(col)                      # brazos y piernas los pone el maniquí
        if n.startswith('top_'):
            Hh,Ww=al.shape; yy=np.arange(Hh)[:,None]; xx=np.arange(Ww)[None,:]
            hz=(yy>=round(43*Hh/72))&((xx<=round(12*Ww/40))|(xx>=round(27*Ww/40)))
            al=al&~(hz&(col.mean(-1)<120))
    out=convert(col,al,n.split('_')[0])
    out=prune(out, 3 if n.startswith('glasses') else 8)
    c=crop(out)
    if c: S[n]=c
S['_meta']={'w':int(W_),'h':int(GH)}
json.dump(S,open(D+'/../sprites.json','w'))
print(len(S))

