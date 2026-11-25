import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.subset import Subsetter, Options
wght=float(sys.argv[1]); sx=float(sys.argv[2]); out=sys.argv[3]
f=TTFont('NotoSerifDisplay.ttf')
f=instantiateVariableFont(f,{'wdth':62.5,'wght':wght})
# subset latin+cyrillic first
opt=Options(); opt.layout_features=['kern','liga','calt','case']; opt.name_IDs=['*']; opt.notdef_outline=True
ss=Subsetter(opt); ss.populate(unicodes=list(range(0x20,0x250))+list(range(0x400,0x460))+[0x2013,0x2014,0x2019,0x201C,0x201D,0x201E,0x2026,0x20AC,0x2116,0x00AB,0x00BB,0x2192,0x2190,0x00D7]); ss.subset(f)
gs=f.getGlyphSet(); glyf=f['glyf']; hmtx=f['hmtx']
from fontTools.pens.recordingPen import DecomposingRecordingPen
rec={}
for name in f.getGlyphOrder():
    rp=DecomposingRecordingPen(gs); gs[name].draw(rp); rec[name]=rp
for name,rp in rec.items():
    pen=TTGlyphPen(None)
    tp=TransformPen(pen,(sx,0,0,1,0,0)); rp.replay(tp)
    glyf[name]=pen.glyph()
    w,lsb=hmtx[name]; hmtx[name]=(round(w*sx), round(lsb*sx))
# kerning GPOS values scale: skip complex; drop GPOS kern to avoid wrong spacing? scale ValueRecords
if 'GPOS' in f:
    del f['GPOS']
for t in ['HVAR','MVAR']:
    if t in f: del f[t]
f['glyf'].compile(f); 
nm=f['name']
for r in nm.names:
    if r.nameID in (1,4,16): r.string='Stellas Tall'
    if r.nameID==6: r.string='StellasTall-Regular'
f['head'].recalcBBoxes=True
f.flavor='woff'; f.save(out); print('saved',out)
