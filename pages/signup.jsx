import { FooterMessage, HeaderMessage } from "./components/common/Messages";
import { useRef, useState, useEffect } from "react";
import { Form, Segment, TextArea, Divider, Button, Message } from 'semantic-ui-react';
import CommonSocials from "./components/common/CommonSocials";
import DragNDrop from "./components/common/DragNDrop";
import axios from "axios";
import catchErrors from './util/catchErrors';
import { setToken } from './util/auth';
let cancel;

const signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  const { name, email, password, bio } = user;

  //*FormStates*/
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [username, setUsername] = useState("");

  const [showSocialLinks, setShowSocialLinks] = useState(false);

  const inputRef = useRef(null);
  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  //* Functions */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicURL;

    if (media !== null) {
      const formData = new FormData();
      formData.append('image', media, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const res = await axios.post('/api/v1/upload', formData);
      profilePicURL = res.data.src;

    }

    if (media !== null && !profilePicURL) {
      setFormLoading(false);
      return res.status(500).send("Something went wrong with the image upload...");
    }

    try {
      const res = await axios.post('/api/v1/user/signup', {
        user,
        profilePicURL
      });

      setToken(res.data);
    } catch (error) {
      const errorMsg = catchErrors(error);
      setErrorMsg(errorMsg);
    }

    setFormLoading(false);

  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'media' && files.length) {
      setMedia(() => files[0])
      setMediaPreview(() => URL.createObjectURL(files[0]));
      setHighlighted(true);
    } else {
      setUser((prev) => ({ ...prev, [name]: value }))
    }
  }


  const checkUsername = async () => {

    const cancelToken = axios.CancelToken
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const res = await axios.get(`/api/v1/user/${username}`, {
        cancelToken: new cancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      if (res.data === 'Available') {
        setUsernameAvailable(true);
        setErrorMsg(null)
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      setErrorMsg("Sorry, this username can't be used!")
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  }

  //* ~~~~~ EFFECTS ~~~~~ /*
  useEffect(() => {
    setSubmitDisabled(!(name && email && password && username));
  }, [user, username])

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);


  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Segment>
          <DragNDrop
            inputRef={inputRef}
            handleChange={handleChange}
            media={media}
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
          />
          <Message 
            error
            content={errorMsg}
            header="Oops!"
            icon="meh"
          />
          <Form.Input
            required
            label="Name"
            placeholder="name"
            name="name"
            value={name}
            onChange={handleChange}
            icon="user"
            iconPosition="left"
          />
          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          <Form.Input
            required
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            icon={
              showPassword
                ? {
                  name: "eye slash",
                  color: "red",
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)
                }
                : {
                  name: "eye",
                  color: "green",
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)
                }
            }
            iconPosition="left"
            type={showPassword ? "text" : "password"}
          />
          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            required label="Username"
            placeholder="Username"
            value={username}
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Divider hidden></Divider>
          <Form.Field
            control={TextArea}
            name="bio"
            value={bio}
            onChange={handleChange}
            placeholder="bio"
          />
          <CommonSocials
            user={user}
            onChange={handleChange}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}

          />
          <Button
            icon="signup"
            content="Sign Up"
            type="submit"
            color="blue"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  )
}

export default signup;