import pymysql
from dotenv import load_dotenv
import os
import sys
load_dotenv()

MARIADB_HOST = os.getenv('MARIADB_HOST')
MARIADB_USER = os.getenv('MARIADB_USER')
MARIADB_PW = os.getenv('MARIADB_PW')
MARIADB_DB = os.getenv('MARIADB_DB')


def update_contract_state(contract_id: int, status: str):
    conn = pymysql.connect(host=MARIADB_HOST, user=MARIADB_USER, port=3306,
                           password=MARIADB_PW, db=MARIADB_DB, charset='utf8')

    cursor = conn.cursor()

    sql = "UPDATE contracts SET status = '" + status + \
        "' WHERE file_id = " + str(contract_id) + ";"
    cursor.execute(sql)
    conn.commit()
    conn.close()
