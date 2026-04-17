import os
import re

# Root src directory
SRC = r'C:\Users\Sneha Ratagal\.gemini\antigravity\scratch\condense-salesplaybook-mirror\src'

# Replacements: ordered from most specific to most general
# Format: (old_pattern, new_value, use_regex)
REPLACEMENTS = [
    # Hardcoded dark hex backgrounds
    (r'bg-\[#020617\]',         'bg-gray-50',     True),
    (r'bg-\[#0b1120\]/80',      'bg-white/90',    True),
    (r'bg-\[#0b1120\]',         'bg-white',       True),
    (r'bg-\[#0f172a\]',         'bg-white',       True),
    (r'bg-\[#020617\]/60',      'bg-gray-50/90',  True),

    # Background colors - dark to light
    ('bg-zinc-950',        'bg-gray-50',    False),
    ('bg-zinc-900/50',     'bg-gray-100/70',False),
    ('bg-zinc-900/80',     'bg-gray-100/90',False),
    ('bg-zinc-900',        'bg-gray-100',   False),
    ('bg-zinc-800/50',     'bg-gray-200/60',False),
    ('bg-zinc-800',        'bg-gray-200',   False),
    ('bg-zinc-700',        'bg-gray-300',   False),
    ('bg-slate-900',       'bg-gray-100',   False),
    ('bg-slate-800',       'bg-gray-200',   False),
    ('bg-slate-700',       'bg-gray-300',   False),
    ('bg-black/80',        'bg-white/80',   False),

    # Gradient from dark to light
    ('from-zinc-800',      'from-blue-50',  False),
    ('from-zinc-900',      'from-gray-100', False),
    ('to-zinc-950',        'to-indigo-100', False),
    ('to-zinc-900',        'to-gray-100',   False),
    ('from-slate-900',     'from-gray-100', False),
    ('to-slate-900',       'to-gray-100',   False),

    # Text colors - dark bg text to light bg text
    ('text-zinc-100',      'text-gray-900', False),
    ('text-zinc-200',      'text-gray-800', False),
    ('text-zinc-300',      'text-gray-700', False),
    ('text-zinc-400',      'text-gray-500', False),
    ('text-zinc-500',      'text-gray-400', False),
    ('text-zinc-600',      'text-gray-400', False),
    ('text-slate-100',     'text-gray-900', False),
    ('text-slate-200',     'text-gray-800', False),
    ('text-slate-300',     'text-gray-700', False),
    ('text-slate-400',     'text-gray-500', False),
    ('text-slate-500',     'text-gray-400', False),

    # White text → dark text (only in className strings, not in CSS values)
    # We use a pattern that matches text-white followed by space, quote, or end
    (r'\btext-white\b',    'text-gray-900', True),

    # Borders
    ('border-zinc-700/50', 'border-gray-200',  False),
    ('border-zinc-700',    'border-gray-200',  False),
    ('border-zinc-800/80', 'border-gray-200',  False),
    ('border-zinc-800',    'border-gray-200',  False),
    ('border-zinc-900',    'border-gray-100',  False),
    ('border-slate-700',   'border-gray-200',  False),
    ('border-slate-800',   'border-gray-200',  False),
    ('border-white/10',    'border-gray-200',  False),
    ('border-white/5',     'border-gray-100',  False),

    # Placeholders
    ('placeholder-zinc-500',  'placeholder-gray-400', False),
    ('placeholder-zinc-600',  'placeholder-gray-300', False),

    # Focus rings - keep or adapt
    ('focus:ring-emerald-500/50',  'focus:ring-blue-500/50',  False),
    ('focus:border-emerald-500/50','focus:border-blue-500/50',False),

    # Hover text
    ('hover:text-white',   'hover:text-gray-900', False),

    # Ring overlay
    ('ring-1 ring-white/10', '', False),

    # Dark accent text
    ('group-focus-within:text-emerald-400', 'group-focus-within:text-blue-600', False),

    # Main page bg + text combo in App.tsx
    ('bg-[#020617] text-zinc-100', 'bg-gray-50 text-gray-900', False),

    # Glow backgrounds that don't make sense in light mode
    ('bg-emerald-900/20', 'bg-blue-200/20', False),
    ('bg-sky-900/20',     'bg-indigo-200/20', False),
    ('bg-emerald-900',    'bg-blue-200',    False),
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement, *args in REPLACEMENTS:
        use_regex = args[0] if args else False
        if use_regex:
            content = re.sub(pattern, replacement, content)
        else:
            content = content.replace(pattern, replacement)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

changed = []
for root, dirs, files in os.walk(SRC):
    # skip node_modules
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if fname.endswith(('.tsx', '.ts', '.css', '.js')):
            fp = os.path.join(root, fname)
            if process_file(fp):
                changed.append(fp.replace(SRC, ''))

print(f"Modified {len(changed)} files:")
for f in changed:
    print(f"  {f}")
