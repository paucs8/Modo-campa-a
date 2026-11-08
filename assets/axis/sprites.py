"""AXIS por capas: base + objetos equipables + ojos cerrados, cofre, moneda y jefe."""
from PIL import Image
OUT='assets/'  # ejecutar desde la raíz del repo
W,H=36,68
c={'K':(17,17,17),'C':(28,28,32),'Cs':(48,48,56),'W':(244,244,244),'H':(22,22,27),'Hh':(44,44,54),'S':(232,191,156),'Ss':(198,150,114),
'L':(226,226,228),'Lg':(184,184,188),'Ld':(132,132,138),'P':(36,36,40),'Pd':(22,22,25),'Pl':(56,56,64),'B':(14,14,16),'M':(181,181,186),
'Sh':(240,240,240),'Sg':(150,150,156),'Bd':(24,24,27),'Tr':(196,196,200),'Wh':(239,227,200),'R':(229,72,60),'Rd':(170,40,34),
'Y':(255,197,61),'Yd':(201,138,0),'Yl':(255,230,150),'Br':(122,78,44),'Brd':(84,52,28),'Brl':(160,108,64),
'G':(140,140,146),'Gd':(70,70,76)}

def canvas(w,h): return Image.new('RGBA',(w,h),(0,0,0,0))
def painter(im):
    px=im.load();w,h=im.size
    def p(x,y,k):
        if 0<=x<w and 0<=y<h: px[x,y]=c[k]+(255,)
    def r(x0,y0,x1,y1,k):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1): p(x,y,k)
    def pts(l,k):
        for x,y in l: p(x,y,k)
    return p,r,pts
def outline(im):
    px=im.load();w,h=im.size;o=im.copy();po=o.load()
    for y in range(h):
        for x in range(w):
            if px[x,y][3]==0 and any(0<=x+dx<w and 0<=y+dy<h and px[x+dx,y+dy][3] for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):
                po[x,y]=c['K']+(255,)
    return o

def axis(items=(), closed=False):
    im=canvas(W,H);p,r,pts=painter(im)
    if 'skate' in items:
        r(30,29,33,63,'Bd'); pts([(30,29),(33,29),(30,63),(33,63)],'K')
        r(31,28,32,28,'Bd'); r(31,64,32,64,'Bd')
        for y in (33,58): r(29,y,34,y+1,'Wh'); r(30,y-1,33,y-1,'Tr')
        pts([(31,45),(32,45),(31,46),(32,46),(31,44),(32,47),(31,47),(32,44)],'W'); pts([(31,43),(32,48)],'Lg')
        r(31,52,32,53,'Ld')
    for y in range(37,61):
        t=(y-37)/23; r(int(round(9-3*t)),y,int(round(23+3*t)),y,'P')
    r(15,47,17,60,'Pd'); p(16,46,'Pd')
    for y in range(39,60):
        if y%5==0: p(11,y,'Pl'); p(21,y,'Pl')
    for x0 in (7,21):
        r(x0,44,x0+4,50,'Pl'); r(x0,44,x0+4,44,'Pd'); r(x0+1,45,x0+3,45,'P')
    pts([(9,47),(22,47)],'Lg')
    for y in range(52,61,2): p(8,y,'Pd'); p(24,y,'Pd')
    r(5,60,14,63,'Sh'); r(18,60,27,63,'Sh'); r(5,64,14,64,'Sg'); r(18,64,27,64,'Sg')
    r(7,60,12,60,'Pd'); r(20,60,25,60,'Pd')
    pts([(9,62),(10,61),(10,62),(11,62),(10,63)],'K'); pts([(22,62),(23,61),(23,62),(24,62),(23,63)],'K')
    r(9,35,23,36,'B'); r(15,35,17,36,'M'); p(16,35,'B')
    if 'llavero' in items:
        for y in range(37,42): p(20,y,'M' if y%2 else 'Ld')
        pts([(19,42),(22,42)],'W'); r(19,43,22,45,'W'); pts([(20,44),(21,44)],'Ld'); r(20,46,21,47,'Lg')
    r(9,19,23,34,'L'); r(6,20,26,22,'L'); r(4,21,9,36,'L'); r(23,21,28,36,'L')
    r(4,34,9,36,'Lg'); r(23,34,28,36,'Lg'); r(9,33,23,34,'Lg')
    r(8,22,8,33,'Lg'); r(24,22,24,33,'Lg')
    r(12,31,20,31,'Lg'); r(12,27,12,31,'Lg'); r(20,27,20,31,'Lg')
    r(10,20,11,32,'B'); r(21,20,22,32,'B'); pts([(10,26),(11,26),(21,26),(22,26)],'M')
    for y in range(20,25): p(14,y,'Ld'); p(18,y,'Ld')
    pts([(14,25),(18,25)],'Ld')
    pts([(17,24),(17,25),(16,26),(17,26),(18,26),(15,26),(19,26),(17,27),(17,28)],'Ld'); p(17,26,'K')
    pts([(6,24),(6,25),(5,26),(6,26),(7,26),(6,27),(6,28)],'Ld'); p(6,26,'K')
    if 'handycam' in items:
        r(0,34,6,39,'Bd'); r(1,35,5,35,'Gd'); pts([(0,36),(0,37)],'G'); r(5,33,6,33,'Bd'); p(2,37,'R')
    r(5,37,8,39,'S'); r(5,39,8,39,'Ss'); r(26,36,29,38,'S'); r(26,38,29,38,'Ss'); r(29,36,30,37,'S')
    r(10,17,22,19,'L'); r(12,18,20,18,'Lg'); r(14,17,18,17,'Ss'); r(14,16,18,17,'Ss')
    if 'auriculares' in items:
        r(12,20,20,20,'B'); r(9,17,12,21,'Bd'); r(20,17,23,21,'Bd'); r(10,18,11,20,'G'); r(21,18,22,20,'G'); pts([(10,19),(22,19)],'R')
    r(11,8,21,15,'S'); r(12,16,20,16,'S'); r(14,17,18,17,'Ss'); r(11,8,21,9,'Ss')
    if closed:
        pts([(13,12),(14,12),(18,12),(19,12)],'K'); pts([(12,13),(20,13)],'Ss')
    else:
        pts([(13,11),(14,11),(18,11),(19,11),(13,12),(19,12)],'K'); pts([(14,12),(18,12)],'Hh'); pts([(12,13),(20,13)],'Ss')
    pts([(16,14),(17,14)],'Ss'); r(15,15,17,15,'S')
    r(8,7,10,15,'H'); r(22,7,24,15,'H'); pts([(7,10),(7,12),(7,14),(25,10),(25,12),(25,14),(9,16),(10,16),(23,16),(22,16),(8,16),(24,16)],'H')
    r(11,8,21,8,'H'); pts([(12,9),(13,9),(15,9),(16,10),(19,9),(20,9),(21,9),(11,9),(11,10),(21,10)],'H')
    pts([(9,9),(23,9),(9,12),(23,12)],'Hh'); p(9,14,'M'); p(23,14,'M')
    r(11,1,21,5,'C'); r(10,2,22,5,'C'); r(12,0,20,0,'C'); r(8,6,24,7,'B'); r(9,6,23,6,'C'); r(13,1,15,2,'Cs')
    pts([(16,1),(16,2),(15,3),(16,3),(17,3),(14,3),(18,3),(16,4),(16,5)],'W')
    return outline(im)

def diff(a,b):
    """Píxeles de b que cambian respecto a a: una capa que se apila encima de a."""
    o=canvas(*a.size);pa,pb,po=a.load(),b.load(),o.load()
    for y in range(a.height):
        for x in range(a.width):
            if pa[x,y]!=pb[x,y]: po[x,y]=pb[x,y] if pb[x,y][3] else (0,0,0,0)
    return o

base=axis(); base.save(OUT+'axis/base.png')
for it in ['llavero','auriculares','handycam','skate']:
    d=diff(base,axis((it,)))
    # un objeto no puede borrar píxeles de la base: si los quita, se dibuja la base encima igualmente
    d.save(OUT+f'axis/{it}.png')
diff(base,axis(closed=True)).save(OUT+'axis/ojos.png')
full=axis(('llavero','auriculares','handycam','skate'))
full.save(OUT+'hero.png'); full.crop((6,0,28,20)).save(OUT+'face.png')

# Cofre 18x15 cerrado y abierto
def chest(open_):
    im=canvas(18,16);p,r,pts=painter(im)
    r(1,8,16,15,'Br'); r(1,8,16,8,'Brl'); r(1,15,16,15,'Brd')
    r(1,11,16,11,'Yd'); r(0,8,0,15,'Brd'); r(17,8,17,15,'Brd')
    if open_:
        r(2,2,15,5,'Brd'); r(2,6,15,7,'Yl'); r(4,5,13,7,'Y'); pts([(6,4),(10,3),(12,5)],'Yl')
        r(1,1,16,1,'Brl'); r(1,2,1,5,'Br'); r(16,2,16,5,'Br')
    else:
        r(1,3,16,7,'Br'); r(1,3,16,3,'Brl'); r(2,2,15,2,'Brl'); r(1,7,16,7,'Yd')
        r(7,6,10,10,'Y'); r(8,8,9,9,'Brd')
    r(3,8,3,15,'Yd'); r(14,8,14,15,'Yd')
    return outline(im)
chest(False).save(OUT+'cofre.png'); chest(True).save(OUT+'cofre-abierto.png')

coin=canvas(9,9);p,r,pts=painter(coin)
r(2,1,6,7,'Y'); r(1,2,7,6,'Y'); r(3,2,5,6,'Yd'); r(4,3,4,5,'Yl'); pts([(2,2),(2,3)],'Yl')
outline(coin).save(OUT+'moneda.png')

# Jefe 26x24: bloque oscuro con cuernos y ojos de estrella
boss=canvas(26,24);p,r,pts=painter(boss)
r(4,6,21,21,'Bd'); r(3,8,22,19,'Bd'); r(5,22,9,23,'Bd'); r(16,22,20,23,'Bd')
pts([(4,5),(5,4),(5,5),(6,3),(20,5),(20,4),(21,5),(19,3)],'G')
r(7,7,18,8,'Gd')
for cx in (9,16):
    pts([(cx,10),(cx,11),(cx-1,12),(cx,12),(cx+1,12),(cx,13),(cx,14)],'R'); p(cx,12,'Yl')
r(8,17,17,18,'K'); pts([(9,17),(11,17),(14,17),(16,17)],'W'); pts([(10,18),(15,18)],'W')
pts([(3,12),(22,12),(2,14),(23,14)],'Gd')
outline(boss).save(OUT+'jefe.png')

