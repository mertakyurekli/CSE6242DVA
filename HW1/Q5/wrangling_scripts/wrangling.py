"""
cse6242 s21
wrangling.py - utilities to supply data to the templates.

This file contains a pair of functions for retrieving and manipulating data
that will be supplied to the template for generating the table. """
import csv

def username():
    return 'yyu441'

def data_wrangling():
    with open('data/movies.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        table = list()
        noOfRows = 100
        # Feel free to add any additional variables
        ...
        
        # Read in the header
        for header in reader:
            break
        
        # Read in each row
        for i, row in enumerate(reader):
            if i <= noOfRows - 1:
                table.append(row)
            else: break
            # Only read first 100 data rows - [2 points] Q5.a
            ...
        
    # Order table by the last column - [3 points] Q5.b
    ...
    table = sorted(table, key=lambda t : float(t[2]), reverse=True)
    
    return header, table

