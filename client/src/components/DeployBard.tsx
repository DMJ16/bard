import React, { useState, useEffect, SyntheticEvent } from "react";
import { navigate } from "hookrouter";
import axios from "axios";
import factory from "../lib/factory";

import { Button, Grid } from "@material-ui/core";

enum Mode {
  DEFAULT,
  AUTO,
  MANUAL,
}

export default function DeployBard() {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState(0);

  useEffect(() => {
    switch (mode) {
      case Mode.DEFAULT:
        navigate("/composebard");
        break;
      case Mode.AUTO:
        navigate("/composebard/auto");
        break;
      case Mode.MANUAL:
        navigate("/composebard/manual");
        break;
    }
  }, [mode]);

  const handleChange = (e: SyntheticEvent) => {
    e.preventDefault();
    setValue((e.target as HTMLTextAreaElement).value);
  };

  return (
    <div>
      {(() => {
        if (mode === 0) {
        } else {
          return (
            <div>
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='center'
              >
                <form>
                  <Grid item>
                    <label>
                      <h3>Name your Bard:</h3>
                      <p>
                        Give your Bard a great name. Not too long, and
                        representative of ALL of the types of art that you
                        intend to use it for.
                      </p>
                      <input
                        type='text'
                        value={value}
                        onChange={handleChange}
                      />
                    </label>
                    <Button type='submit' value='Submit'>
                      Confirm Name
                    </Button>
                  </Grid>
                  <Grid item>
                    <label>
                      <h3>Give your Bard a symbol:</h3>
                      <p>
                        This is a roughly 1 to 5 letter UPPERCASE abbreviation
                        meant to mimic a tranditional stock ticker symbol. For
                        example, Apple goes by APPL and Microsoft goes by MSFT.
                      </p>
                      <input
                        type='text'
                        value={value}
                        onChange={handleChange}
                      />
                    </label>
                    <Button type='submit' value='Submit'>
                      Confirm Symbol
                    </Button>
                  </Grid>
                  <Grid item>
                    {(() => {
                      if (mode === 1) {
                        return (
                          <>
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
                              <input type='file' />
                              <input
                                type='text'
                                value={value}
                                onChange={handleChange}
                              />
                            </label>
                            <Button type='submit' value='Submit'>
                              Confirm Metadata URI
                            </Button>
                          </>
                        );
                      } else if (mode === 2) {
                        return (
                          <>
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
                              <input
                                type='text'
                                value={value}
                                onChange={handleChange}
                              />
                            </label>
                            <Button type='submit' value='Submit'>
                              Confirm Metadata URI
                            </Button>
                          </>
                        );
                      }
                    })()}
                  </Grid>
                </form>
              </Grid>
            </div>
          );
        }
      })()}
    </div>
  );
}
