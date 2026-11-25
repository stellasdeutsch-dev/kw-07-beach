# Упаковать байты файла в PNG без сжатия (оттенки серого), чтобы передать данные в Figma через upload_assets.
import sys, zlib, struct
src, dst = sys.argv[1], sys.argv[2]
data = open(src, 'rb').read()
payload = struct.pack('>I', len(data)) + data
W = 2048
H = (len(payload) + W - 1) // W
payload += b'\0' * (W * H - len(payload))
raw = b''.join(b'\0' + payload[y * W:(y + 1) * W] for y in range(H))
def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 0, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 0)) + chunk(b'IEND', b'')
open(dst, 'wb').write(png)
print(dst, len(data), 'bytes ->', len(png))
