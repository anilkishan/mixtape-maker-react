import React, { Component, DOM } from "react";
import Tape from "../components/Tape";
import PersonalMessage from "../components/PersonalMessage";
import Grid from "@material-ui/core/Grid";
import { Button } from "react-rainbow-components";
import ScrollArea from "react-scrollbar";
import Tracks2 from "../components/Tracks2";
import tapeBlack from "../tape2.png";
import tapeRed from "../tape_red.png";
import tapeGreen from "../tape_green.png";
import TextTrackArea from "../components/TextTrackArea";
import { withRouter } from "react-router-dom";

let imgUrl =
  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/470470/5107c1158cfe9f8552383ff5490c793ae14c34c9.jpg";

class CreateMixtape extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finalMixtape: [],
      tapeText: "",
      selectedPlaylist: [],
      personalMessage: "",
      selectedPlaylistID: null,
      tapeColour: tapeBlack
    };
  }

  // find the object within the array that matches the key
  // then replace the value within that object

  handleTapeText = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handlePersonalMessage = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleTapeColour = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleTrackComment = (track, event) => {
    const value = event.target.value;
    const track_id = track.track_id;

    const trackComment = {
      track_id: track_id,
      comment: value,
      artist: track.artist,
      duration: track.image,
      name: track.name,
      preview: track.preview,
      mixtape_id: this.state.selectedPlaylistID
    };
    // get current comments

    let currentComments = this.state.finalMixtape;

    // if the comment song id already exists, find it and declare it
    let existingComment = currentComments.find(
      trackComment => trackComment.track_id === track_id
    );
    // find the the Index of the existing comment
    let existingCommentIndex = this.state.finalMixtape.findIndex(
      trackComment => trackComment.track_id === track_id
    );
    //in the currentComments, replace 1 element, at the existingComment index with the new track comment
    currentComments.splice(existingCommentIndex, 1, trackComment);

    // const updatedComments = [currentComents.slice(0, existingCommentIndex),trackComment, currentComents.slice(existingCommentIndex + 1) ]
    this.setState({
      finalMixtape: currentComments
    });
  };

  componentDidMount() {
    this.fetchPlaylist(this.props.computedMatch.params.id);
  }

  fetchPlaylist = selectedPlaylist => {
    fetch(`http://localhost:3000/playlist/${selectedPlaylist}`, {
      headers: {
        ["Authorization"]: localStorage.token
      }
    })
      .then(resp => resp.json())
      .then(selectedPlaylist => {
        this.setState(
          {
            selectedPlaylist: selectedPlaylist,
            selectedPlaylistID: this.props.computedMatch.params.id
          },
          () => this.setTrackComments()
        );
      });
  };

  setTrackComments = () => {
    let track_objs = this.state.selectedPlaylist.map(track => ({
      name: track.name,
      preview: track.preview,
      track_id: track.track_id,
      duration: track.image,
      artist: track.artist,
      comment: "",
      mixtape_id: this.state.selectedPlaylistID
    }));
    this.setState({
      finalMixtape: track_objs
    });
  };

  saveMixtape = () => {
    this.postMixtape().then(this.props.history.push("/mixtapes"));
  };

  postMixtape = () => {
    return fetch("http://localhost:3000/mixtapes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ["Authorization"]: localStorage.token
      },
      body: JSON.stringify({
        mixtape: {
          user_id: this.props.user.id,
          name: this.state.tapeText,
          personal_message: this.state.personalMessage,
          mixtape_id: this.state.selectedPlaylistID,
          tape_colour: this.state.tapeColour,
          tracks: this.state.finalMixtape
        }
      })
    });
  };

  render() {
    return (
      <div class="bg">
        <Grid container xs={12}>
          <Grid item xs={6}>
            <Tape
              handleTapeText={this.handleTapeText}
              tapeImage={this.state.tapeImage}
              tapeText={this.state.tapeText}
              handleTapeColour={this.handleTapeColour}
            />
            <PersonalMessage
              handlePersonalMessage={this.handlePersonalMessage}
            />{" "}
            <Button
              shaded
              label="Save Mixtape"
              variant="success"
              className="rainbow-m-around_medium"
              onClick={this.saveMixtape}
            />
          </Grid>
          <Grid xs={6}>
            <ScrollArea
              speed={0.8}
              className="area"
              contentClassName="content2"
              horizontal={false}
            >
              <TextTrackArea />
              <Tracks2
                selectedPlaylist={this.state.selectedPlaylist}
                handleTrackComment={this.handleTrackComment}
              />
            </ScrollArea>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// add this to have the fully animated background
{
  /* <div class="areabg">
  <ul class="circles">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div> */
}

// Add this to div to bring in the cool background

// className="Component-Bg"
// style={{
//   backgroundImage: "url(" + imgUrl + ")",
//   backgroundSize: "cover",
//   backgroundPosition: "center center",
//   backgroundRepeat: "no-repeat"
// }}

export default withRouter(CreateMixtape);
