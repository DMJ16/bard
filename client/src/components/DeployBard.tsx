import React, { useState, useEffect, SyntheticEvent, ChangeEvent } from "react";
import { navigate } from "hookrouter";
import { Button, Grid } from "@material-ui/core";
import { pinJSONToIPFS, JSONBody, Success } from "../lib/pinata";
import axios from "axios";
import factory from "../lib/factory";

enum Mode {
  DEFAULT,
  CREATE_URI,
  HAS_URI,
}

export default function DeployBard() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uriDescription, setUriDescription] = useState("");
  const [formData, setFormData] = useState<{ [key: string]: any }>();
  const [uri, setUri] = useState("");
  const [hash, setHash] = useState("");
  const [mode, setMode] = useState(0);

  useEffect(() => {
    switch (mode) {
      case Mode.DEFAULT:
        navigate("/composebard");
        break;
      case Mode.CREATE_URI:
        navigate("/composebard/createuri");
        break;
      case Mode.HAS_URI:
        navigate("/composebard/hasuri");
        break;
    }
  }, [mode]);

  const handleNameChange = (e: SyntheticEvent) => {
    e.preventDefault();
    setName((e.target as HTMLTextAreaElement).value);
  };

  const handleSymbolChange = (e: SyntheticEvent) => {
    e.preventDefault();
    setSymbol((e.target as HTMLTextAreaElement).value);
  };

  const handleUriChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (mode === 1) {
      setUriDescription(e.target.value);
    } else if (mode === 2) {
      // setFormData({
      //   [e.target.name]: e.currentTarget.files?.[0],
      // });

      fileReader(e.currentTarget.files?.[0]).then(console.log);

      function fileReader(file: any) {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          if (fileReader) {
            fileReader.onload = () => {
              resolve((fileReader.result as string).split(/base64,/)[1]);
            };
            fileReader.onerror = () => {
              reject(fileReader.error);
            };
            fileReader.readAsDataURL(file);
          }
        });
      }
    }
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    const newMode = parseInt((e.currentTarget as HTMLButtonElement).value);
    setMode(newMode);
  };

  const handleJSONSubmit = () => {
    // const returnData = await pinJSONToIPFS(inputJSON);
    // if (returnData?.data.IpfsHash) setHash(returnData?.data.IpfsHash);
  };

  return (
    <div>
      {(() => {
        if (mode === 0) {
          return (
            <div>
              <Grid
                container
                direction='column'
                justify='center'
                alignContent='center'
              >
                <Grid item>
                  <h1>Bard Composition</h1>
                </Grid>
                <Grid item>
                  <h2>🧙🏻‍♂️: Welcome, let's compose a new Bard Contract.</h2>
                </Grid>
              </Grid>

              <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
              >
                <Grid item xs={5}>
                  <div>
                    <Button value={1} onClick={handleClick}>
                      <h4>
                        Click here to create a new metadata uri.
                        <br />
                        <i>Make sure you have your creative content handy!</i>
                      </h4>
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={5}>
                  <div>
                    <Button value={2} onClick={handleClick}>
                      <h4>Click here if you already have a metadata uri.</h4>
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          );
        } else {
          return (
            <div>
              <form>
                <Grid
                  container
                  direction='column'
                  justify='center'
                  alignItems='center'
                >
                  <Grid item xs={3}>
                    <label>
                      <h3>Name your Bard:</h3>
                      <p>
                        Give your Bard a great name. Not too long, and
                        representative of ALL of the types of art that you
                        intend to use it for.
                      </p>
                      <input
                        type='text'
                        value={name}
                        onChange={handleNameChange}
                      />
                    </label>
                    <Button type='submit' value='Submit'>
                      Confirm Name
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      <h3>Give your Bard a symbol:</h3>
                      <p>
                        This is a roughly 1 to 5 letter UPPERCASE abbreviation
                        meant to mimic a tranditional stock ticker symbol. For
                        example, Apple goes by APPL and Microsoft goes by MSFT.
                      </p>
                      <input
                        type='text'
                        value={symbol}
                        onChange={handleSymbolChange}
                      />
                    </label>
                    <Button type='submit' value='Submit'>
                      Confirm Symbol
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    {(() => {
                      if (mode === 1) {
                        return (
                          <div>
                            <label>
                              <h3>Input your Bard's Metadata</h3>
                              <p>
                                Your metadata uri is a special url that leads to
                                your artistic work. If you have not already
                                pinned your work to IPFS 📌, or if you have not
                                done this before, this is a great option. All
                                you have to do is upload your creative
                                materials, and we'll handle storage using IPFS
                                and Piñata 🦙.{" "}
                                <link onClick={() => setMode(2)} />
                                please click here.{" "}
                              </p>
                              <h5>Upload creative content here:</h5>
                              <input type='file' />
                              <h5>Upload image here:</h5>
                              <input type='file' />
                              <h5>
                                Write a description of your product. Double
                                check your inputs, and when you are ready to
                                submit click Confirm below:
                              </h5>
                              <input
                                type='text'
                                value={uriDescription}
                                onChange={handleUriChange}
                              />
                            </label>
                            <Button type='submit' value='Submit'>
                              Confirm Metadata URI
                            </Button>
                          </div>
                        );
                      } else if (mode === 2) {
                        return (
                          <div>
                            <label>
                              <h3>Input your Bard's Metadata</h3>
                              <p>
                                Your metadata uri is a special url that leads to
                                your artistic work. If you have not already
                                pinned your work to IPFS 📌, or if you have not
                                done this before,{" "}
                                <link onClick={() => setMode(2)} />
                                please click here. All you have to do is upload
                                your creative materials, and we'll handle
                                storage using IPFS and Piñata 🦙.
                              </p>
                              <h5>Upload Metadata Uri in JSON format:</h5>
                              <input
                                type='file'
                                name='uri'
                                onChange={handleUriChange}
                              />
                            </label>
                            <Button onClick={handleJSONSubmit}>
                              Confirm Metadata URI
                            </Button>
                          </div>
                        );
                      }
                    })()}
                  </Grid>
                </Grid>
              </form>
            </div>
          );
        }
      })()}
    </div>
  );
}
