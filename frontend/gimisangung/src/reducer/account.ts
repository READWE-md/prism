// 액션 타입을 선언합니다
// 뒤에 as const 를 붙여줌으로써 나중에 액션 객체를 만들게 action.type 의 값을 추론하는 과정에서
// action.type 이 string 으로 추론되지 않고 'counter/INCREASE' 와 같이 실제 문자열 값으로 추론 되도록 해줍니다.
const SAVE = "account/SAVE" as const;
const ADD = "account/ADD" as const;
const REMOVE = "account/REMOVE" as const;

// 액션 생성함수를 선언합니다
export const save = (
  username: string,
  path: number[],
  pathName: string[],
  email: string,
  userId: number
) => ({
  type: SAVE,
  payload: { username, path, pathName, email, userId },
});

export const add = (newPath: number, newPathName: string) => ({
  type: ADD,
  payload: { newPath, newPathName },
});

export const remove = (targetPath: number) => ({
  type: REMOVE,
  payload: { targetPath },
});

// export const increaseBy = (diff: number) => ({
//   type: INCREASE_BY,
//   // 액션에 부가적으로 필요한 값을 payload 라는 이름으로 통일합니다
//   // 이는 FSA (https://github.com/redux-utilities/flux-standard-action) 라는 규칙인데
//   // 이 규칙을 적용하면 액션들이 모두 비슷한 구조로 이루어져있게 되어 추후 다룰 때도 편하고
//   // 읽기 쉽고, 액션 구조를 일반화함으로써 액션에 관련돤 라이브러리를 사용 할 수 있게 해줍니다.
//   // 다만, 무조건 꼭 따를 필요는 없습니다.
//   payload: diff,
// });

// 모든 액션 겍체들에 대한 타입을 준비해줍니다.
// ReturnType<typeof _____> 는 특정 함수의 반환값을 추론해줍니다
// 상단부에서 액션타입을 선언 할 떄 as const 를 하지 않으면 이 부분이 제대로 작동하지 않습니다.
type AccountAction =
  | ReturnType<typeof save>
  | ReturnType<typeof add>
  | ReturnType<typeof remove>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
interface AccountState {
  username: string;
  path: number[];
  pathName: string[];
  email: string;
  userId: number;
}

// 초기상태를 선언합니다.
const initialState: AccountState = {
  username: "",
  path: [],
  pathName: [""],
  email: "",
  userId: 0,
};

// 리듀서를 작성합니다.
// 리듀서에서는 state 와 함수의 반환값이 일치하도록 작성하세요.
// 액션에서는 우리가 방금 만든 CounterAction 을 타입으로 설정합니다.
const account = (
  state: AccountState = initialState,
  action: AccountAction
): AccountState => {
  switch (action.type) {
    case SAVE:
      return {
        username: action.payload.username,
        path: action.payload.path,
        pathName: action.payload.pathName,
        email: action.payload.email,
        userId: action.payload.userId,
      };
    case ADD:
      return {
        ...state,
        path: [...state.path, action.payload.newPath],
        pathName: [...state.pathName, action.payload.newPathName],
      };
    case REMOVE:
      return {
        ...state,
        path: state.path.slice(0, action.payload.targetPath + 1),
        pathName: state.pathName.slice(0, action.payload.targetPath + 1),
      };
    default:
      return state;
  }
};

export default account;
