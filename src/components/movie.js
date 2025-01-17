import React, { useState, useEffect } from "react";
import movieDataService from "../services/movies";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Image,
  Col,
  Row,
  Button,
  Media,
} from "react-bootstrap";
import moment from "moment";

const Movie = (props) => {
  //default state
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  //getting a specific movie's information
  const getMovie = id => {
    movieDataService.get(id)
      .then(response => {
        setMovie(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //renders specific movie info once- onfirst render
  useEffect(() => {
    getMovie(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    //identify review by review and user ids
    movieDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setMovie((currState) => {
          //put index into splice method to remove that review from list/database
          currState.reviews.splice(index, 1);
          return {
            ...currState,
          };
        });
      })
      .catch((e) => {
        //print error message
        console.log(e);
      });
  };

  return (
    <div>
      {/* card to display a specific movie's information */}
      <Container>
        <Row>
          <Col>
            <Image src={movie.poster + "/100px250"} fluid />
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {props.user && (
                  <Link to={"/movies/" + props.match.params.id + "/review"}>
                    Add Review
                  </Link>
                )}
              </Card.Body>
            </Card>
            <br></br>
            <h2>Reviews</h2>
            <br></br>
            {/* mapping reviews for movie*/}
            {movie.reviews.map((review, index) => {
              return (
                <Media key={index}>
                  <Media.Body>
                    {/* username and date posted. date is formatteed */}
                    <h5>
                      {review.name + " reviewed on "}{" "}
                      {moment(review.date).format("Do MMMM YYYY")}
                    </h5>
                    <p>{review.review}</p>
                    {props.user && props.user.id === review.user_id && (
                      <Row>
                        <Col>
                        {" "}
                          <Link
                            to={{
                              // path for reviews
                              pathname:
                                "/movies/" + props.match.params.id + "/review",
                              state: { currentReview: review },
                              //link to edit
                            }}
                          >
                            Edit
                          </Link>
                        </Col>
                        {/* link to delete */}
                        <Col>
                          {/* pass in review_id & index from the movie.reviews.map function */}
                          <Button
                            variant="link"
                            onClick={() => deleteReview(review._id, index)} // call the deleteReview function from above
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Media.Body>
                </Media>
              );
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Movie;
