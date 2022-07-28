import json
import pandas as pd

# Folder with all the files required for the task
assets_folder = "assets/"

# Array to save all the final grades of all the students
final_grades = []

# Writer for the result xlsx file
xlWriter = pd.ExcelWriter("Result.xlsx", engine = 'xlsxwriter')

# Reading the students json file
with open(assets_folder + "Students.json", "r") as f:
    students = json.loads(json.loads(f.read()))

# Converting the students json into dataframe
student_df = pd.DataFrame(students)

# Reading both of the quiz files and the homework and exam file
quiz_1_df = pd.read_csv(assets_folder + "quiz_1_grades.csv")
quiz_2_df = pd.read_csv(assets_folder + "quiz_2_grades.csv")
h_and_e_df = pd.read_csv(assets_folder + "Homework and exams.csv")

# Inner join all the dataframes into one
merged_df = pd.merge(quiz_1_df[["Last Name", "First Name", "Grade"]], quiz_2_df[["Last Name", "First Name", "Grade"]], on=["Last Name", "First Name"])
merged_df = pd.merge(merged_df, h_and_e_df[["Last Name", "First Name", "Homework 1", "Homework 2", "Homework 3", "Exam"]], on=["Last Name", "First Name"])

# Calculate all the final grades
for row in merged_df.itertuples():
    final_grades.append(int((((row[3] * 10) + (row[4] * 10)) / (4 * 2)) + ((row[5] + row[6] + row[7]) / (10 * 3)) + (row[8] * 65 / 100)))

# Add the final grades to the merged_df data frame
merged_df["Final Grade"] = final_grades

# Split the last and first names of the students for the inner join
student_df[["Last Name", "First Name"]] = student_df["Name"].str.split(",", expand=True)

# Removing any part of the name that will affect the inner join with the merged_df data frame
student_df["First Name"] = student_df["First Name"].str.split(expand = True)[0]
student_df["Last Name"] = student_df["Last Name"].str.split(expand = True)[0]

# Merging the stuudents student_df with the others
merged_df = pd.merge(merged_df, student_df[["Group", "First Name", "Last Name", "Name", "ID"]], on=["Last Name", "First Name"]).sort_values(by=["Final Grade"], ascending=False)

# Finishing the data for creation
for i in range(1,4):
    sheet_df = merged_df[merged_df["Group"] == i] # Filtering by group number
    sheet_df = sheet_df[["Name", "ID", "Final Grade"]] # Taking only relevent columns
    sheet_df = sheet_df.rename(columns={"Name" : "Student Name", "ID" : "Student ID"}) # Changing the column names
    sheet_df.to_excel(xlWriter, sheet_name="Group " + str(i)) # Adding each sheet to the xlsx writer

# Saving the xlsx result file to the system
xlWriter.save()