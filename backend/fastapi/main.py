from fastapi import FastAPI, Path, BackgroundTasks
# from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from modules.analyze_contract import analyze_contract

load_dotenv()
app = FastAPI()


class Contract(BaseModel):
    images: list[str]


@app.post("/contract/{contract_id}")
def create_contract(contract_id: int, contract_raw: Contract, background_tasks: BackgroundTasks):

    # analyze_contract(contract_raw, contract_id)
    # 계약서 분석(백그라운드 처리)
    background_tasks.add_task(analyze_contract, contract_raw, contract_id)

    # MongoDB의 ID값 반환
    return {"_id": contract_id, "message": "Pending"}
