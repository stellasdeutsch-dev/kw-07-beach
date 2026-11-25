import json,sys
src=sys.argv[1]; d=json.load(open(src))
names=[]
def nm(s):
    if s not in names: names.append(s)
    return names.index(s)
def hx(c):
    if not c: return None
    r,g,b,a=c; s='%02x%02x%02x'%(round(r),round(g),round(b))
    return s if a>=0.999 else s+'%02x'%round(a*255)
def fl(fs):
    out=[]
    for f in fs:
        if f['t']=='s': out.append(hx(f['c']))
        elif f['t']=='i': out.append('@'+f['src'])
        else: out.append([round(f['ang'])]+[[hx(c),round(p,3)] for c,p in f['stops']])
    return out
def I(v): return round(v)
def pk(n):
    k=n['k']; o={'k':k}
    if k!='t': o['n']=nm(n['n']) if k in('f','s','rg','sc') else n['n']
    o['b']=[I(n['x']),I(n['y']),I(n['w']),I(n['h'])]
    if n.get('f'): o['f']=fl(n['f'])
    if n.get('r'): o['r']=n['r'] if len(set(n['r']))>1 else n['r'][0]
    if n.get('sh'): s=n['sh']; o['sh']=[I(s[0]),I(s[1]),I(s[2]),I(s[3]),hx(s[4])]
    if n.get('st'): s=n['st']; o['st']=[s[0],hx(s[1]),s[2]]
    if n.get('clip'): o['cl']=1
    if n.get('op') is not None: o['op']=n['op']
    if n.get('m'): o['m']=[round(v,4) for v in n['m']]
    if k=='i': o['src']=n['src']; o['fit']=n['fit'][0]
    if k=='s': o['ic']=n['ic']; o['sc']=hx(n['sc']) if n.get('sc') and n['sc'][3]>0 else None; o['fc']=hx(n['fc']) if n.get('fc') and n['fc'][3]>0 else None; o['sw']=n['sw']
    if k=='rg': o.update(text=n['text'],fc=hx(n['fc']),fs=n['fs'],fw=n['fw'],ls=n['ls'])
    if k=='sc': o.update(fc=hx(n['fc']),sc=hx(n['sc']),sw=n['sw'])
    if k=='t':
        o['s']=[[r[0]] if len(r)==1 else [r[0],r[1],hx(r[2]),r[3],r[4],r[5],r[6]] for r in n['s']]
        o['t']=[n['fs'],n['ff'],round(n['lh'],1),round(n['ls'],2),n['al'][0],n['ml'],I(n['ex']),I(n['ew'])]
    if n.get('c'): o['c']=[pk(c) for c in n['c']]
    return o
blocks=[[b['name'],b['id'],I(b['y']),I(b['h']),pk(b['tree'])] for b in d['blocks']]
out={'w':d['w'],'H':I(d['H']),'N':names,'B':blocks}
s=json.dumps(out,ensure_ascii=False,separators=(',',':'))
open(src.replace('.json','.pack.json'),'w').write(s)
print(src, len(s), [ (b[0], len(json.dumps(b,ensure_ascii=False,separators=(',',':')))) for b in blocks])
