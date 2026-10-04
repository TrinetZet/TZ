from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math
ROOT=Path(__file__).resolve().parents[1]
RES=ROOT/'app/src/main/res'
OUT=Path('/Users/vladislav/Documents/Codex/2026-10-04/clientbridge/outputs/android/icon')
NAVY='#151d29'; MINT='#b9f0cb'; IVORY='#f6f7ef'
paths=[('M40,34 H33 Q30,34 30,37 V71 Q30,74 33,74 H40',MINT),('M68,34 H75 Q78,34 78,37 V71 Q78,74 75,74 H68',MINT),('M44,64 L64,44 M48,44 H64 V60',IVORY)]
def svg(background=True):
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 108 108">'+ ('<rect width="108" height="108" fill="'+NAVY+'"/>' if background else '')+''.join(f'<path d="{p}" fill="none" stroke="{c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' for p,c in paths)+'</svg>\n'
def icon(size,mask=None):
    S=4; im=Image.new('RGBA',(size*S,size*S),NAVY); d=ImageDraw.Draw(im); scale=size*S/108
    def line(points,color):
        pts=[(round(x*scale),round(y*scale)) for x,y in points]; w=round(6*scale)
        d.line(pts,fill=color,width=w,joint='curve')
        for x,y in pts:
            r=w/2; d.ellipse((x-r,y-r,x+r,y+r),fill=color)
    # Sample exact quadratic corner curves for matching Android/SVG geometry.
    def quad(a,b,c): return [((1-t)**2*a[0]+2*(1-t)*t*b[0]+t*t*c[0],(1-t)**2*a[1]+2*(1-t)*t*b[1]+t*t*c[1]) for t in [i/16 for i in range(17)]]
    line([(40,34),(33,34)]+quad((33,34),(30,34),(30,37))+[(30,71)]+quad((30,71),(30,74),(33,74))+[(40,74)],MINT)
    line([(68,34),(75,34)]+quad((75,34),(78,34),(78,37))+[(78,71)]+quad((78,71),(78,74),(75,74))+[(68,74)],MINT)
    line([(44,64),(64,44)],IVORY);line([(48,44),(64,44),(64,60)],IVORY)
    if mask:
        m=Image.new('L',im.size,0);md=ImageDraw.Draw(m)
        if mask=='circle':md.ellipse((0,0,im.width-1,im.height-1),fill=255)
        else:md.rounded_rectangle((0,0,im.width-1,im.height-1),radius=im.width*.23,fill=255)
        im.putalpha(m)
    return im.resize((size,size),Image.Resampling.LANCZOS)
for f in ['drawable','mipmap-anydpi-v26','mipmap-anydpi-v33']: (RES/f).mkdir(parents=True,exist_ok=True)
(RES/'drawable/ic_launcher_background.xml').write_text('<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle"><solid android:color="'+NAVY+'" /></shape>\n')
for mono in [False,True]:
    xml='<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">\n'
    for p,c in paths:xml+=f'    <path android:pathData="{p}" android:fillColor="@android:color/transparent" android:strokeColor="{"#ffffff" if mono else c}" android:strokeWidth="6" android:strokeLineCap="round" android:strokeLineJoin="round" />\n'
    xml+='</vector>\n';(RES/('drawable/ic_launcher_monochrome.xml' if mono else 'drawable/ic_launcher_foreground.xml')).write_text(xml)
for api in [26,33]:
    xml='<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@drawable/ic_launcher_background" />\n    <foreground android:drawable="@drawable/ic_launcher_foreground" />\n'+('    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />\n' if api==33 else '')+'</adaptive-icon>\n'
    for name in ['ic_launcher','ic_launcher_round']:(RES/f'mipmap-anydpi-v{api}'/f'{name}.xml').write_text(xml)
for density,size in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
    folder=RES/f'mipmap-{density}';folder.mkdir(exist_ok=True)
    icon(size,'squircle').save(folder/'ic_launcher.png');icon(size,'circle').save(folder/'ic_launcher_round.png')
for dir in [ROOT/'icon',OUT]:
    (dir/'clientbridge-icon.svg').write_text(svg());(dir/'clientbridge-foreground.svg').write_text(svg(False))
    for size in [512,1024]:icon(size).save(dir/f'clientbridge-icon-{size}.png')
canvas=Image.new('RGB',(1500,1000),'#eef1ed');d=ImageDraw.Draw(canvas)
font='/System/Library/Fonts/Supplemental/Arial.ttf'
f=lambda size:ImageFont.truetype(font,size)
d.text((80,65),'ClientBridge',font=f(46),fill=NAVY);d.text((80,125),'ANDROID LAUNCHER ICON',font=f(18),fill='#65726b')
for x,mask,label in [(80,'squircle','Rounded square'),(540,'circle','Circle'),(1000,None,'Source artwork')]:
    im=icon(360,mask);canvas.paste(im,(x,220),im);d.text((x,610),label,font=f(24),fill=NAVY)
d.text((80,730),'Clear at every size',font=f(26),fill=NAVY)
for x,size in [(80,48),(200,72),(350,96),(540,144)]:
    im=icon(size,'squircle');canvas.paste(im,(x,800),im);d.text((x,800+size+12),f'{size} px',font=f(17),fill='#65726b')
d.text((920,795),'NAVY  #151D29',font=f(20),fill=NAVY);d.text((920,840),'MINT  #B9F0CB',font=f(20),fill=NAVY);d.text((920,885),'Rounded brackets + rising arrow',font=f(20),fill=NAVY)
canvas.save(OUT/'clientbridge-icon-preview.png');canvas.save(ROOT/'icon/clientbridge-icon-preview.png')
(ROOT/'icon/README.md').write_text('''# ClientBridge Android launcher icon

The navy field and mint brackets preserve ClientBridge’s existing `[↗]` identity. An ivory rising arrow conveys progress through better conversations. Rounded strokes remain clear at launcher sizes.

The 108 × 108 adaptive foreground places the entire mark inside the central 66 dp safe region. Android controls the final mask. Android 13 themed icons use the same geometry in a single color.

- `clientbridge-icon.svg`: scalable flat source, full background.
- `clientbridge-foreground.svg`: transparent vector foreground.
- `clientbridge-icon-512.png`, `clientbridge-icon-1024.png`: export artwork.
- `clientbridge-icon-preview.png`: launcher mask and size preview.
- `generate.py`: deterministic resource/export regeneration, requires Pillow.

Resources are in `app/src/main/res`: adaptive mipmaps for API 26/33, vector foreground/background/monochrome, and mdpi through xxxhdpi PNG fallback icons (48/72/96/144/192 px). `ic_launcher_round` shares the adaptive design and has circular legacy fallback artwork.
''')
print('Generated icon resources and exports.')
