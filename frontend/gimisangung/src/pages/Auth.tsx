import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { save } from "../reducer/account";

const Url = process.env.REACT_APP_LOGIN_URL;
const Auth = () => {
  const params = new URL(document.URL).searchParams;
  const code = params.get("code");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios({
      method: "post",
      url: Url,
      data: {
        code,
      },
    })
      .then((res) => {
        dispatch(
          save(
            res.data.username,
            [res.data.rootDirectoryId],
            ["홈"],
            res.data.email,
            res.data.id
          )
        );
      })
      .then((res) => {
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, []);

  return <div>{code}</div>;
};

export default Auth;
