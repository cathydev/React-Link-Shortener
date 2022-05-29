import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SearchURL = styled(SearchIcon)(({ theme }) => ({
  cursor: "pointer",
}));

const HTTP_URL_VALIDATOR_REGEX =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;

function App() {
  const [posted, setPost] = useState(null);
  const [url, setURL] = useState("");
  const [open, setOpen] = useState(false);
  const textInput = useRef(null);

  const validateURL = (string) => {
    return string.match(HTTP_URL_VALIDATOR_REGEX);
  };

  const handleChange = (e) => {
    setURL(e.target.value);
  };

  async function handleClick(e) {
    if (validateURL(url)) {
      await axios.post(`https://api.shrtco.de/v2//shorten?url=${url}`)
         .then((response) => {
           console.log(response.data);
           setPost(response.data.result.short_link);
         })
         .catch(function (error) {
           console.log(error);
         });
    } else {
      setPost("Not a valid URL");
    }
    textInput.current.value = "";
    setOpen(true)
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="80vh"
      >
        <h1>Link shortener</h1>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Short your URL"
          variant="outlined"
          inputRef={textInput}
          onChange={handleChange}
          InputProps={{ endAdornment: <SearchURL onClick={handleClick} /> }}
        />
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
            severity= {validateURL(url) ? "success" : "error"} 
          >
            {posted}
          </Alert>
        </Collapse>
      </Box>
    </Container>
  );
}

export default App;
