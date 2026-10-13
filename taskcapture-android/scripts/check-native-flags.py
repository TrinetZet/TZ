import pathlib,json
root=pathlib.Path(__file__).resolve().parents[1]
commands=[]
for p in (root/'app/.cxx').rglob('compile_commands.json'):
 commands.extend(json.loads(p.read_text()))
inference=[x for x in commands if x['file'].endswith('/engine.cpp') or x['file'].endswith('/ggml-cpu.cpp')]
assert inference,'No inference compile commands found'
for c in inference:
 assert '-O3' in c['command'] or '-O2' in c['command'],f"Unoptimized inference kernel: {c['file']}"
for c in inference:
 if '/x86_64/' in c['command'] and c['file'].endswith('/ggml-cpu.cpp'):
  assert '-mavx' in c['command'] and '-msse4.2' in c['command'],'Missing emulator SIMD acceleration'
print(f'Optimized inference commands: {len(inference)}')
