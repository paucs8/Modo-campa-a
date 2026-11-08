"""Objetos, cofre, moneda, jefe e icono en pixel art con volumen y contorno de color."""
from PIL import Image, ImageDraw
import math
OUT='/home/claude/modo-campa-a/'
def hx(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def mul(c,f): return tuple(max(0,min(255,round(v*f))) for v in c)
def tint(c,f): return tuple(round(v+(255-v)*f) for v in c)
def mix(a,b,t): return tuple(round(x*(1-t)+y*t) for x,y in zip(a,b))
K=(17,17,17)
class Art:
    def __init__(s,w,h): s.w,s.h=w,h; s.px={}; s.zone=1
    def at(s,z): s.zone=z
    def p(s,x,y,c,z=None):
        if 0<=x<s.w and 0<=y<s.h: s.px[(x,y)]=(hx(c) if isinstance(c,str) else c, s.zone if z is None else z)
    def r(s,x0,y0,x1,y1,c):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1): s.p(x,y,c(x,y) if callable(c) else c)
    def pts(s,l,c):
        for x,y in l: s.p(x,y,c)
    def ellipse(s,cx,cy,rx,ry,c):
        for y in range(int(cy-ry)-1,int(cy+ry)+2):
            for x in range(int(cx-rx)-1,int(cx+rx)+2):
                if ((x-cx)/rx)**2+((y-cy)/ry)**2<=1: s.p(x,y,c(x,y) if callable(c) else c)
    def render(s):
        im=Image.new('RGBA',(s.w,s.h),(0,0,0,0)); out=im.load()
        zone=lambda x,y: s.px[(x,y)][1] if (x,y) in s.px else -1
        for (x,y),(c,z) in s.px.items():
            f=1
            if z>0:
                if zone(x+1,y)!=z: f*=0.84
                if zone(x,y+1)!=z: f*=0.88
                if zone(x-1,y)!=z: f*=1.1
                if zone(x,y-1)!=z: f*=1.08
            v=mul(c,f) if f<1 else tint(c,(f-1)*1.1)
            out[x,y]=v+(255,)
        lit=im.copy(); L=lit.load(); o=im.copy(); O=o.load()
        for y in range(s.h):
            for x in range(s.w):
                if (x,y) in s.px: continue
                for dx,dy in ((0,1),(0,-1),(1,0),(-1,0)):
                    if (x+dx,y+dy) in s.px:
                        c=L[x+dx,y+dy][:3]; O[x,y]=mix(mul(c,0.32),K,0.45)+(255,); break
        return o

def save(a,name,folder='assets/items/'): a.render().save(OUT+folder+name+'.png')
GOLD='#F2B632'; GOLDD='#C98A00'; GOLDL='#FFE69A'; METAL='#B8BCC4'; DARK='#26262C'; RED='#E5483C'

# Llavero: anilla, cadena y estrella con gema
a=Art(22,30); a.at(1)
for t in range(0,360,12):
    x=round(11+5*math.cos(math.radians(t))); y=round(6+5*math.sin(math.radians(t))); a.p(x,y,METAL)
a.at(0); a.r(10,11,11,13,METAL); a.at(2)
star=[(11,14),(10,15),(11,15),(12,15),(10,16),(11,16),(12,16),(4,17),(5,17),(6,17),(7,17),(8,17),(9,17),(10,17),(11,17),(12,17),(13,17),(14,17),(15,17),(16,17),(17,17),(18,17)]
for y in range(17,27):
    w=[11,10,9,8,8,8,9,9,10,10][y-17]
for y,(x0,x1) in enumerate([(10,12),(10,12),(9,13),(3,19),(4,18),(5,17),(6,16),(6,16),(5,17),(5,17),(4,9),(13,18),(4,7),(15,18)],start=14):
    a.r(x0,y,x1,y,GOLD)
a.at(0); a.r(10,19,12,21,RED); a.p(10,19,'#FF9A8C'); a.pts([(8,18),(7,19)],GOLDL)
save(a,'llavero')

# Botella de agua
a=Art(18,32); a.at(1); a.r(6,0,11,3,'#2D5BD7'); a.r(5,2,12,3,'#2D5BD7'); a.at(2); a.r(6,4,11,5,'#9FC3FF')
a.at(3); a.r(3,6,14,30,'#4F8FE0'); a.r(4,30,13,31,'#4F8FE0')
a.at(4); a.r(3,13,14,19,'#F2F2F2'); a.at(0); a.r(5,15,12,15,'#2D5BD7'); a.r(5,17,10,17,'#9FC3FF')
a.at(0); a.r(5,8,6,12,'#BFD9FF'); a.r(5,21,6,27,'#BFD9FF'); a.r(7,22,12,22,'#9FC3FF')
save(a,'botella')

# Cascos
a=Art(30,26); a.at(1)
for t in range(185,356,4):
    x=round(15+11*math.cos(math.radians(t))); y=round(14+11*math.sin(math.radians(t)))
    a.r(x,y,x,y+1,DARK)
a.at(2); a.r(1,12,7,23,DARK); a.r(22,12,28,23,DARK); a.at(3); a.r(3,14,6,21,'#5A5A64'); a.r(23,14,26,21,'#5A5A64')
a.at(0); a.r(4,16,5,19,RED); a.r(24,16,25,19,RED); a.pts([(9,6),(10,5),(11,4)],'#5A5A64')
save(a,'auriculares')

# Móvil
a=Art(18,32); a.at(1); a.r(1,0,16,31,'#2B2B33'); a.at(2); a.r(3,3,14,27,'#8FB7FF')
a.at(0)
for i,col in enumerate(['#E5483C','#F2B632','#3E7C3A','#8C6FE0','#E97FB0','#2D5BD7']):
    x=4+(i%3)*4; y=6+(i//3)*5; a.r(x,y,x+2,y+2,col)
a.r(4,17,13,19,'#FFFFFF'); a.r(4,21,10,22,'#C9DCFF'); a.r(6,1,11,1,'#55555F'); a.r(7,29,10,29,'#77777F')
save(a,'movil')

# Mancuerna
a=Art(34,18); a.at(1); a.r(0,5,3,12,DARK); a.at(2); a.r(4,2,8,15,'#3A3A42'); a.at(3); a.r(25,2,29,15,'#3A3A42'); a.at(4); a.r(30,5,33,12,DARK)
a.at(5); a.r(9,7,24,10,METAL); a.at(0)
for x in range(11,23,2): a.p(x,8,'#8A8E96')
a.r(5,3,6,5,'#6A6A74'); a.r(26,3,27,5,'#6A6A74')
save(a,'mancuerna')

# Handycam
a=Art(34,22); a.at(1); a.r(2,6,22,17,DARK); a.at(2); a.r(23,7,28,16,'#3E3E46'); a.at(3); a.r(29,8,32,15,'#55555F')
a.at(0); a.r(30,9,31,14,'#5A7DB8'); a.p(30,9,'#BFD9FF'); a.at(4); a.r(5,1,16,5,'#3E3E46'); a.at(0); a.r(7,2,13,3,'#77777F')
a.r(4,8,10,10,'#55555F'); a.p(19,8,RED); a.at(5); a.r(3,18,12,20,'#3E3E46')
save(a,'handycam')

# Skate (vista de arriba)
a=Art(16,40); a.at(1)
a.r(3,2,12,37,'#C68E58'); a.r(4,1,11,1,'#C68E58'); a.r(4,38,11,38,'#C68E58'); a.r(5,0,10,0,'#C68E58'); a.r(5,39,10,39,'#C68E58')
a.at(2); a.r(4,3,11,36,'#2B2B33'); a.at(0)
for y in range(4,36,3): a.p(5+(y%5),y,'#3A3A44')
a.r(6,15,9,24,RED); a.r(7,16,8,23,'#FF8A7C'); a.pts([(7,14),(8,14),(7,25),(8,25)],RED)
a.at(3)
for y in (7,31): a.r(0,y,15,y+2,'#EFE3C8'); a.at(0); a.r(4,y+1,11,y+1,METAL); a.at(3)
save(a,'skate')

# Cofre cerrado y abierto (40x34)
def chest(open_):
    a=Art(40,34)
    a.at(1); a.r(2,16,37,32,'#8E5A32')
    a.at(0)
    for y in (20,24,28): a.r(3,y,36,y,'#6E4426')
    a.at(2); a.r(2,16,37,17,'#A86E40')
    a.at(3); a.r(6,16,9,32,GOLD); a.r(30,16,33,32,GOLD); a.r(2,31,37,32,GOLDD)
    if open_:
        a.at(4); a.r(4,2,35,8,'#6E4426'); a.r(5,1,34,1,'#8E5A32'); a.r(6,3,9,8,GOLDD); a.r(30,3,33,8,GOLDD)
        a.at(5); a.ellipse(20,13,15,4,GOLD)
        a.at(0)
        for x,y in [(10,12),(14,10),(19,11),(24,10),(28,12),(17,13),(22,13),(12,14),(27,14)]: a.r(x,y,x+2,y+1,GOLDL)
        a.pts([(20,9),(15,8),(26,8)],'#FFFFFF')
    else:
        a.at(4); a.r(2,6,37,15,'#9C6438'); a.r(4,4,35,5,'#9C6438'); a.r(7,3,32,3,'#9C6438')
        a.at(0); a.r(3,10,36,10,'#7A4A2A'); a.at(5); a.r(6,4,9,15,GOLD); a.r(30,4,33,15,GOLD)
        a.at(6); a.r(16,11,23,20,GOLD); a.at(0); a.r(19,14,20,17,'#5A3A1C'); a.p(17,12,GOLDL)
    return a
chest(False).render().save(OUT+'assets/cofre.png'); chest(True).render().save(OUT+'assets/cofre-abierto.png')

# Moneda 14x14 con estrella
a=Art(14,14); a.at(1); a.ellipse(6.5,6.5,6,6,GOLD); a.at(0); a.ellipse(6.5,6.5,4,4,GOLDD)
a.pts([(6,3),(7,3),(5,5),(6,5),(7,5),(8,5),(4,6),(9,6),(5,7),(6,7),(7,7),(8,7),(5,9),(8,9),(6,8),(7,8)],GOLDL); a.pts([(3,3),(3,4),(4,2)],'#FFF6D0')
a.render().save(OUT+'assets/moneda.png')

# Jefe 44x40
a=Art(44,40); a.at(1)
a.ellipse(22,22,17,15,'#2E2A3A'); a.r(8,24,36,34,'#2E2A3A')
a.at(2); a.r(9,35,15,38,'#2E2A3A'); a.at(3); a.r(29,35,35,38,'#2E2A3A')
a.at(4)
for i in range(7): a.r(7+i//2,7+i,9+i//2,7+i,'#9A96A8'); a.r(34-i//2,7+i,36-i//2,7+i,'#9A96A8')
a.at(5); a.r(2,22,6,28,'#2E2A3A'); a.at(6); a.r(37,22,41,28,'#2E2A3A')
a.at(0)
for cx in (15,29):
    a.r(cx-3,17,cx+3,21,'#FFE0E0'); a.r(cx-1,18,cx+1,21,'#E5483C'); a.p(cx,18,'#FFFFFF')
a.r(11,15,18,15,'#141218'); a.r(26,15,33,15,'#141218'); a.pts([(12,14),(32,14)],'#141218')
a.r(13,26,31,30,'#141218'); a.r(14,27,30,27,'#F2F2F2')
for x in range(15,30,3): a.r(x,28,x+1,29,'#F2F2F2')
a.r(10,10,14,12,'#4A4458'); a.p(11,10,'#6A6478')
a.render().save(OUT+'assets/jefe.png')

# Icono de la app: cofre abierto sobre lila con destellos
ch=chest(True).render()
LIL=(199,181,255,255)
def icon(size,pad,round_=False):
    im=Image.new('RGBA',(size,size),LIL)
    avail=int(size*(1-2*pad)); sc=max(1,avail//max(ch.size)); c2=ch.resize((ch.width*sc,ch.height*sc),Image.NEAREST)
    im.alpha_composite(c2,((size-c2.width)//2,(size-c2.height)//2+size//30))
    d=ImageDraw.Draw(im); u=max(1,size//64)
    for sx,sy in [(0.2,0.22),(0.8,0.2),(0.86,0.62)]:
        x,y=int(size*sx),int(size*sy); d.rectangle((x-u,y-3*u,x+u,y+3*u),fill=(255,255,255,255)); d.rectangle((x-3*u,y-u,x+3*u,y+u),fill=(255,255,255,255))
    return im
icon(192,.14).save(OUT+'icons/icon-192-cofre.png'); icon(512,.14).save(OUT+'icons/icon-512-cofre.png'); icon(512,.24).save(OUT+'icons/icon-maskable-512-cofre.png')
icon(180,.12).convert('RGB').save(OUT+'icons/apple-touch-icon-cofre.png')
fav=icon(64,.06); m=Image.new('L',(64,64),0); ImageDraw.Draw(m).rounded_rectangle((0,0,63,63),radius=13,fill=255); f=Image.new('RGBA',(64,64),(0,0,0,0)); f.paste(fav,(0,0),m); f.save(OUT+'icons/favicon-cofre.png')

# Vista previa
names=['llavero','botella','auriculares','movil','mancuerna','handycam','skate']
ims=[Image.open(OUT+f'assets/items/{n}.png') for n in names]+[Image.open(OUT+'assets/'+n+'.png') for n in ('cofre','cofre-abierto','moneda','jefe')]
W=sum(i.width for i in ims)+6*len(ims)+70; prev=Image.new('RGBA',(W,44),(197,232,108,255)); x=4
for i in ims: prev.alpha_composite(i,(x,(44-i.height)//2)); x+=i.width+6
prev.alpha_composite(icon(64,.06).resize((40,40),Image.NEAREST),(x,2))
prev.resize((prev.width*3,prev.height*3),Image.NEAREST).save('preview-art.png')
print('ok')
