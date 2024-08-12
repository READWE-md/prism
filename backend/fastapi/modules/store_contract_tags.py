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

    select_tag_id_sql = "SELECT tag_id FROM tags WHERE contract_id=" + \
        str(contract_id)
    cursor.execute(select_tag_id_sql)
    result = cursor.fetchall()

    for idx, tag in enumerate(tag_list):
        tag_id = result[idx][0]
        if tag == "":
            tag = "."
        sql = "UPDATE tags SET name='" + tag + "' WHERE tag_id=" + str(tag_id)
        print(sql)
        cursor.execute(sql)
    conn.commit()
    conn.close()
