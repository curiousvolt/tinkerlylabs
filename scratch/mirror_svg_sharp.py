CENTER_X = 729.0

# Left Inner (Part C)
part_c_raw = [
    ("L", [702.5, 68.1182]),
    ("L", [702.211, 115.875]),
    ("C", [675.596, 121.661, 647.875, 138.614, 629.644, 158.814]),
    ("C", [604.815, 186.323, 594.297, 224.756, 596.169, 261.289]),
    ("C", [550.632, 260.059, 499.345, 261.22, 453.437, 261.211]),
    ("L", [453.503, 284.299]),
    ("L", [124.965, 284.257]),
    ("L", [124.983, 316.369]), # sharp step!
    ("L", [0.0, 316.519])
]

# Left Outer (Part D)
part_d_raw = [
    ("L", [0.382882, 303.014]),
    ("L", [111.576, 302.901]),
    ("C", [111.78, 292.187, 111.884, 281.472, 111.891, 270.757]),
    ("L", [333.773, 270.679]),
    ("C", [368.757, 270.645, 405.054, 271.173, 439.854, 270.471]),
    ("L", [440.3, 247.936]),
    ("C", [486.666, 247.014, 535.487, 247.95, 582.065, 247.752]),
    ("C", [582.772, 228.711, 588.986, 201.26, 596.986, 184.236]),
    ("C", [616.0, 143.773, 648.395, 120.069, 689.059, 104.725]),
    ("C", [688.969, 92.5379, 689.094, 80.3499, 689.436, 68.1669]),
    ("L", [679.678, 67.9729]),
    ("L", [679.846, 54.8531]),
    ("L", [689.932, 54.5741]),
    ("C", [693.19, 25.9062, 705.154, 14.3612, 728.278, 0.0])
]

# Track coordinates of Part C and Part D
def build_detailed_list(commands, initial_pt=(0.0, 0.0)):
    curr_x, curr_y = initial_pt
    detailed = []
    for cmd, args in commands:
        start_pt = (curr_x, curr_y)
        if cmd == "M" or cmd == "L":
            curr_x, curr_y = args[0], args[1]
        elif cmd == "C":
            curr_x, curr_y = args[4], args[5]
        detailed.append({
            "cmd": cmd,
            "args": args,
            "start": start_pt,
            "end": (curr_x, curr_y)
        })
    return detailed

# Let's see: Part C starts at center inner top. Let's assume it starts at (728.129, 68.19)
detailed_c = build_detailed_list(part_c_raw, (728.129, 68.19))
# Part D starts at Part C's end (0.0, 316.519)
detailed_d = build_detailed_list(part_d_raw, detailed_c[-1]["end"])

def mirror_pt(x, y):
    return round(2 * CENTER_X - x, 3), y

def reverse_and_mirror(detailed_cmds):
    reversed_cmds = []
    for item in reversed(detailed_cmds):
        cmd = item["cmd"]
        args = item["args"]
        start = item["start"]
        end = item["end"]
        
        # Mirror the points
        m_start = mirror_pt(*start)
        m_end = mirror_pt(*end)
        
        if cmd == "L":
            reversed_cmds.append(("L", list(m_start)))
        elif cmd == "C":
            m_cp1 = mirror_pt(args[0], args[1])
            m_cp2 = mirror_pt(args[2], args[3])
            reversed_cmds.append(("C", [m_cp2[0], m_cp2[1], m_cp1[0], m_cp1[1], m_start[0], m_start[1]]))
    return reversed_cmds

# Part A (Right Outer) is the reversed mirror of Part D.
# Part D ends at (728.278, 0). Its mirror starts at (729.722, 0).
# Part D starts at (0.0, 316.519). Its mirror ends at (1458.0, 316.519).
# So Part A starts at (729.722, 0) and ends at (1458.0, 316.519).
# We want the path to start with `M 728.278 0` (original center top).
# So we add M 728.278 0, then a line to Part A's start (729.722, 0) is not needed if we just start Part A at (728.278, 0).
# Let's make the start of Part A exact: `M 728.278 0`.
part_a_commands = [("M", [728.278, 0.0])] + reverse_and_mirror(detailed_d)

# Part B (Right Inner) is the reversed mirror of Part C.
# Part C starts at (728.129, 68.19) and ends at (0.0, 316.519).
# Mirrored Part C starts at (729.871, 68.19) and ends at (1458.0, 316.519).
# So Part B (reversed mirror of Part C) starts at (1458.0, 316.519) and ends at (729.871, 68.19).
part_b_commands = reverse_and_mirror(detailed_c)

# Now, we combine them:
# Right side: Part A + Part B
# Left side: Part C + Part D
# Let's check the transition between Part B and Part C:
# Part B ends at (729.871, 68.19).
# Part C starts at (702.5, 68.1182) (as per part_c_raw).
# So we can just add the raw Part C and Part D!
all_commands = part_a_commands + part_b_commands + part_c_raw + part_d_raw + [("Z", [])]

# Build the SVG path string
path_str = ""
for cmd, args in all_commands:
    path_str += cmd
    formatted_args = []
    for val in args:
        if val == int(val):
            formatted_args.append(str(int(val)))
        else:
            formatted_args.append(f"{val:.3f}".rstrip('0').rstrip('.'))
    path_str += " ".join(formatted_args)

print("SHARP SYMMETRICAL PATH:")
print(path_str)

with open("sharp_path.txt", "w") as f:
    f.write(path_str)
