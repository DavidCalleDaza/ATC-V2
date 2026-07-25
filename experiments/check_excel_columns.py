import pandas as pd
from pathlib import Path

def main():
    sprint_dir = Path("user_stories/sprint-02")
    excels = list(sprint_dir.rglob("*.xlsx"))
    
    print("Columnas encontradas en los Excels (Header = 6):")
    print("-" * 50)
    for excel in excels:
        if "~$" in excel.name: continue
        try:
            # Replicar lógica de excel_parser
            xls = pd.ExcelFile(excel)
            target_sheet = None
            for name in xls.sheet_names:
                if "Diseño" in name or "Ejecuci" in name:
                    target_sheet = name
                    break
            if not target_sheet and len(xls.sheet_names) > 0:
                target_sheet = xls.sheet_names[0]

            df = pd.read_excel(excel, sheet_name=target_sheet, header=6)
            df = df.dropna(how="all")
            df.columns = df.columns.astype(str).str.strip()
            
            # Identify a potential "Pasos" column
            pasos_col = None
            for col in df.columns:
                if "paso" in col.lower() or "acción" in col.lower() or "procedimiento" in col.lower() or "descripci" in col.lower():
                    pasos_col = col
                    break
                    
            if pasos_col:
                print(f"\n{excel.name} => '{pasos_col}'")
                
                # Check population
                total_rows = len(df)
                empty_rows = df[pasos_col].isna().sum()
                
                print(f"  Vacíos: {empty_rows} de {total_rows}")
                if total_rows > empty_rows:
                    sample = df[pasos_col].dropna().iloc[0]
                    print(f"  Ejemplo: {str(sample)[:100]}...")
            else:
                print(f"\n{excel.name} => ¡ALERTA! No se encontró columna para pasos.")
                print(f"  Cols: {list(df.columns)}")
        except Exception as e:
            print(f"Error procesando {excel.name}: {e}")

if __name__ == "__main__":
    main()
