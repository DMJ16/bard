import React from "react";
import { A } from "hookrouter";

export default function FAQ() {
  return (
    <div>
      <p>🧑🏽‍🎨: What is a metadata uri?</p>
      <p>🧑🏽‍🎨: What is a Bard? </p>
      <p>
        🧑🏽‍🎨: And why are we doing anything with <i>contracts?</i>{" "}
      </p>
      <br />
      <p>
        🧙🏻‍♂️: Great question! A Bard is a Smart Contract that mints an arbitrary
        amount of non-fungible and/or semi-fungible tokens.
      </p>
      <br />
      <p>
        🧙🏻‍♂️: You can think of a token as a package or a wrapper that contains
        something of real world value. In our case, each token produced by your
        Bard is an immutible and uncopyable digital representation of your art.
      </p>
      <br />
      <p>
        🧙🏻‍♂️: We will discuss token fungibility and the token minting process
        later--or we can do that right now if you prefer.{" "}
        <A href='/mint'>Please click here.</A>
      </p>
      <br />
      <p>
        🧙🏻‍♂️: Since you chose to stay, let's continue our discussion. Bards are
        smart contracts, so let's unpack that. These contracts are pieces of
        code that are similar to real world contracts. However, they are{" "}
        <i>smart</i> because the code is able to self-execute efficiently and
        reliably.
      </p>
      <br />
      <p>
        🧙🏻‍♂️: In the past, frequently there was one person or a group of people
        who seemed to weild too strong of a sway on the outcomes of previously
        agreed upon, and seemingly neutral, terms or rules. That is precisely
        issue that <i>"smart contracts"</i>
        aim to solve. There is an opportunity to give autonomy and power back to
        those who too often must contract or get into disproportionately
        unfavorable agreememnts with service providers.
      </p>
    </div>
  );
}
