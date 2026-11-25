# Сборка вырезки из нескольких кропов: каждый кроп режется cutout, маска ставится на своё место в полном кадре.
import sys, subprocess, json, numpy as np, cv2
from PIL import Image
raw, out, crops = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
R = np.array(Image.open(raw).convert('RGB')); H, W = R.shape[:2]
A = np.zeros((H, W), np.uint8)
for k, (x0, y0, x1, y1) in enumerate(crops):
    c = R[y0:y1, x0:x1]; cp = f'_crop{k}.png'; cc = f'_cropcut{k}.png'
    Image.fromarray(c).save(cp)
    subprocess.run([str(__import__('pathlib').Path.home() / '.claude/skills/cutout/scripts/cutout'), cp, cc], check=True, capture_output=True)
    cut = np.array(Image.open(cc).convert('RGBA'))
    m = (cut[..., 3] > 128).astype(np.uint8)
    res = cv2.matchTemplate(c.astype(np.float32), cut[..., :3].astype(np.float32), cv2.TM_SQDIFF, mask=np.dstack([m]*3).astype(np.float32))
    _, _, (mx, my), _ = cv2.minMaxLoc(res)
    h, w = cut.shape[:2]
    A[y0+my:y0+my+h, x0+mx:x0+mx+w] = np.maximum(A[y0+my:y0+my+h, x0+mx:x0+mx+w], cut[..., 3])
    print('crop', k, 'at', x0+mx, y0+my, w, h)
rgba = np.dstack([R, A]); ys, xs = np.where(A > 8)
pad = 6; bb = (max(0, xs.min()-pad), max(0, ys.min()-pad), min(W, xs.max()+pad), min(H, ys.max()+pad))
Image.fromarray(rgba).crop(bb).save(out); print('bbox', bb)
