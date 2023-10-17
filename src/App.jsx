import { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const App = () => {
  const [formState, setFormState] = useState({
    findWord: false,
    countWords: true,
    searchWord: "",
  });
  const [wordFound, setWordFound] = useState(null);
  const [numberOfWords, setNumberOfWords] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formState.findWord) {
      const formData = new FormData();
      formData.append("file", formState.file);
      formData.append("word", formState.searchWord);

      axios
        .post("http://localhost:3000/api/v1/file/find-word", formData)
        .then((res) => {
          setWordFound(res.data.found);
          console.log("Carga exitosa", res.data);
        })
        .catch((error) => {
          console.error("Error de carga", error);
        });
    }

    if (formState.countWords) {
      const formData = new FormData();
      formData.append("file", formState.file);
      axios
        .post(`http://localhost:3000/api/v1/file/count-words`, formData)
        .then((res) => {
          setNumberOfWords(res.data.numberOfWords);
          console.log("Carga existosa", res.data);
        });
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">Procesar archivo</Typography>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Button component="label" variant="contained">
                    Subir archivo
                    <VisuallyHiddenInput
                      name="file"
                      type="file"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        setFormState({ ...formState, file: selectedFile });
                      }}
                    />
                  </Button>
                </Box>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Contar palabras"
                    name="count-words"
                    onChange={() =>
                      handleInputChange({
                        target: {
                          name: "countWords",
                          value: !formState.countWords,
                        },
                      })
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Buscar una palabra"
                    name="find-word"
                    onChange={() =>
                      handleInputChange({
                        target: {
                          name: "findWord",
                          value: !formState.findWord,
                        },
                      })
                    }
                  />
                  {formState.findWord && (
                    <Input
                      type="text"
                      placeholder="Palabra a buscar"
                      name="searchWord"
                      value={formState.searchWord}
                      onChange={handleInputChange}
                    />
                  )}
                </FormGroup>
                <Box>
                  {wordFound !== null && (
                    <Typography>
                      {wordFound ? "La palabra existe" : "La palabra no existe"}
                    </Typography>
                  )}
                  {numberOfWords !== null && (
                    <Typography>
                      {`${numberOfWords} palabras encontradas`}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button type="submit">Contar palabras</Button>
              </CardActions>
            </Card>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};
