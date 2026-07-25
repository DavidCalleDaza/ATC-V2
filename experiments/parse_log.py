import sys
log_path = "/mnt/c/Users/jesus/.gemini/antigravity-ide/brain/2bbe7780-4f6f-4772-85ee-6deb8162720f/.system_generated/tasks/task-1343.log"
print("| CP_ID | Rango Trazabilidad | Score Fuzzy | ¿Acierta Fuzzy? | Score Semántico | ¿Acierta Semántico? |")
print("|---|---|---|---|---|---|")
with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        if "| CP_" in line:
            print(line[line.find("| CP_"):].strip())
