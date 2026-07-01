# Let's define all commands of the original path as a single list.
# We will identify the segments:
# - Part A (Right Outer): index 0 to 14 (starts with M 728.278 0, ends at L 1457.85 316.361)
# - Part B (Right Inner): index 15 to 23 (starts with C 1416.15..., ends at C 744.95... 728.129 68.19)
#
# Then we will automatically construct Part C and Part D by mirroring.

CENTER_X = 729.0

part_a_raw = [
    ("M", [728.278, 0]),
    ("C", [730.935, 1.13734, 738.617, 6.51368, 741.035, 8.50031]),
    ("C", [757.655, 22.1476, 763.216, 34.3356, 765.964, 54.7136]),
    ("L", [776.568, 54.8588]),
    ("L", [776.717, 68.2238]),
    ("C", [773.465, 68.1528, 770.115, 68.1751, 766.856, 68.1569]),
    ("L", [766.748, 104.52]),
    ("C", [789.681, 111.347, 810.715, 123.403, 828.201, 139.74]),
    ("C", [859.063, 168.268, 872.852, 206.659, 874.519, 247.945]),
    ("C", [920.474, 247.264, 970.836, 247.422, 1016.8, 247.989]),
    ("L", [1017.13, 270.546]),
    ("C", [1125.76, 272.181, 1236.54, 270.157, 1345.45, 270.818]),
    ("L", [1345.63, 302.755]),
    ("C", [1382.37, 303.574, 1421.01, 303.018, 1457.9, 303.061]),
    ("L", [1457.85, 316.361])
]

part_b_raw = [
    ("C", [1416.15, 316.832, 1373.84, 316.466, 1332.11, 316.334]),
    ("C", [1301.23, 283.614, 1266.99, 284.379, 1236.12, 284.385]),
    ("L", [1003.92, 284.211]),
    ("L", [1003.85, 261.355]),
    ("C", [957.121, 260.399, 907.923, 261.294, 860.895, 261.164]),
    ("C", [862.521, 219.367, 848.946, 176.253, 817.242, 147.844]),
    ("C", [797.751, 130.38, 778.243, 122.075, 753.405, 115.264]),
    ("L", [753.174, 68.1421]),
    ("C", [744.955, 67.977, 736.373, 68.1462, 728.129, 68.19])
]

# We will trace the coordinates to have correct start points for every command.
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

# Process Part A starting at (0.0, 0.0) (since it has its own 'M' command, the initial doesn't matter)
detailed_a = build_detailed_list(part_a_raw, (0.0, 0.0))
# Process Part B starting at Part A's end point
detailed_b = build_detailed_list(part_b_raw, detailed_a[-1]["end"])

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
            # Reversed goes from m_end to m_start
            reversed_cmds.append(("L", list(m_start)))
        elif cmd == "C":
            m_cp1 = mirror_pt(args[0], args[1])
            m_cp2 = mirror_pt(args[2], args[3])
            # Reversed goes from m_end to m_start with control points reversed
            reversed_cmds.append(("C", [m_cp2[0], m_cp2[1], m_cp1[0], m_cp1[1], m_start[0], m_start[1]]))
    return reversed_cmds

# Part C (Left Inner) is the reversed mirror of Part B
# Since Part B ends at Dome Inner Top (728.129, 68.19),
# and its mirror (Part C's start) starts at (729.871, 68.19).
# We bridge from Part B's end (728.129, 68.19) to Part C's start (729.871, 68.19) using a line command first.
part_c_commands = [("L", [729.871, 68.19])] + reverse_and_mirror(detailed_b)

# Part D (Left Outer) is the reversed mirror of Part A
part_d_commands = reverse_and_mirror(detailed_a)

# Combine everything
all_commands = part_a_raw + part_b_raw + part_c_commands + part_d_commands + [("Z", [])]

# Build the SVG path string
path_str = ""
for cmd, args in all_commands:
    path_str += cmd
    # Format numbers nicely
    formatted_args = []
    for val in args:
        if val == int(val):
            formatted_args.append(str(int(val)))
        else:
            formatted_args.append(f"{val:.3f}".rstrip('0').rstrip('.'))
    path_str += " ".join(formatted_args)

print("CORRECTED PATH:")
print(path_str)

with open("mirrored_path.txt", "w") as f:
    f.write(path_str)
