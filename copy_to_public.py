import os
import shutil

root_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(root_dir, 'public')

print("Starting python copy to public...")
os.makedirs(public_dir, exist_ok=True)

# 1. Copy all html files
for f in os.listdir(root_dir):
    if f.endswith('.html'):
        src = os.path.join(root_dir, f)
        dest = os.path.join(public_dir, f)
        shutil.copy2(src, dest)
        print(f"Copied HTML: {f}")

# 2. Copy css
css_src = os.path.join(root_dir, 'css')
css_dest = os.path.join(public_dir, 'css')
if os.path.exists(css_src):
    shutil.copytree(css_src, css_dest, dirs_exist_ok=True)
    print("Copied css/")

# 3. Copy js
js_src = os.path.join(root_dir, 'js')
js_dest = os.path.join(public_dir, 'js')
if os.path.exists(js_src):
    shutil.copytree(js_src, js_dest, dirs_exist_ok=True)
    print("Copied js/")

# 4. Copy assets
assets_src = os.path.join(root_dir, 'assets')
assets_dest = os.path.join(public_dir, 'assets')
if os.path.exists(assets_src):
    shutil.copytree(assets_src, assets_dest, dirs_exist_ok=True)
    print("Copied assets/")

# 5. Copy data
data_src = os.path.join(root_dir, 'data')
data_dest = os.path.join(public_dir, 'data')
if os.path.exists(data_src):
    shutil.copytree(data_src, data_dest, dirs_exist_ok=True)
    print("Copied data/")

# 6. Copy wp-content directly to public/wp-content
wp_src = os.path.join(root_dir, 'assets', 'remote', 'wp-content')
wp_dest = os.path.join(public_dir, 'wp-content')
if os.path.exists(wp_src):
    shutil.copytree(wp_src, wp_dest, dirs_exist_ok=True)
    print("Copied wp-content/")

print("Finished successfully!")
