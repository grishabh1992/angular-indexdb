Angular Excel Example

Uses `exceljs` module to do excel validation.

Created service `ExcelService` which can be integrated in any project for excel kind of utility. I created on of the function in which I styling header font of excel. You can changes according to your requirement.

I am passing three Parameters in `exportAsExcelFile` function of excel.service.
    1. Data array( It is the list of object which information we will show row wise).
    2. Name of file.
    3. Headers (It is list of object of column keys which used for show information column wise of row. With this configuration we pass style options)
