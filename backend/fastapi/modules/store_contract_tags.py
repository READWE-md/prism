import pymysql
from dotenv import load_dotenv
import os
import sys
load_dotenv()

MARIADB_HOST = os.getenv('MARIADB_HOST')
MARIADB_USER = os.getenv('MARIADB_USER')
MARIADB_PW = os.getenv('MARIADB_PW')
MARIADB_DB = os.getenv('MARIADB_DB')


def store_contract_tags(contract_id: int, tag_list: list[str]):
    conn = pymysql.connect(host=MARIADB_HOST, user=MARIADB_USER, port=3306,
                           password=MARIADB_PW, db=MARIADB_DB, charset='utf8')

    cursor = conn.cursor()

    for tag in tag_list:
        sql = "INSERT INTO tags (name, contract_id) " + \
            "VALUES('" + tag + "', '" + str(contract_id) + "')"
        print(sql)
        cursor.execute(sql)
    conn.commit()
    conn.close()
