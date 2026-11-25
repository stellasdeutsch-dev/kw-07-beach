# Убирает белые островки фона между прядями: заливка от прозрачной области по светлым серым пикселям.
import sys
import numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert('RGBA')).astype(int)
r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
mn = np.minimum(np.minimum(r, g), b); mx = np.maximum(np.maximum(r, g), b)
light = (mn > 200) & ((mx - mn) < 30)
reach = a < 20
cand = light | reach
for _ in range(2000):
    d = reach.copy()
    d[1:] |= reach[:-1]; d[:-1] |= reach[1:]; d[:, 1:] |= reach[:, :-1]; d[:, :-1] |= reach[:, 1:]
    d &= cand
    if (d == reach).all(): break
    reach = d
mask = reach & light
# второй проход: светлые серые пиксели у самого края фигуры (закрытые прядями островки)
near = a < 20
for _ in range(int(sys.argv[3]) if len(sys.argv) > 3 else 0):
    d = near.copy(); d[1:] |= near[:-1]; d[:-1] |= near[1:]; d[:, 1:] |= near[:, :-1]; d[:, :-1] |= near[:, 1:]; near = d
light2 = (mn > 185) & ((mx - mn) < 40)
mask |= near & light2
im[..., 3][mask] = 0
Image.fromarray(im.astype('uint8')).save(dst)
print(src, 'removed px:', int(mask.sum()))
