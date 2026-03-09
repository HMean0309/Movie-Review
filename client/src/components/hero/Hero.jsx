import './Hero.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Hero = ({ movies }) => {

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <div className='movie-carousel-container'>
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4000}
                swipeable={true}
                draggable={true}
                showDots={true}
                containerClass="carousel-container"
            >
                {
                    movies?.map((movie) => {
                        return (
                            <div key={movie.imdbId} className='movie-card-container'>
                                <div className="movie-card" style={{ backgroundImage: `url(${movie.backdrops ? movie.backdrops[0] : movie.poster})` }}>
                                    
                                    <div className="movie-detail">
                                        <div className="movie-poster">
                                            <img src={movie.poster} alt={movie.title} />
                                        </div>
                                        
                                        <div className="movie-info-column">
                                            <div className="movie-title">
                                                <h1>{movie.title}</h1>
                                                <h4 className="text-white-50 fst-italic">{movie.originalTitle}</h4>
                                            </div>

                                            <div className="movie-buttons-container">
                                                <Link to={`/Reviews/${movie.imdbId}`} className="text-decoration-none d-flex align-items-center">
                                                    <div className="play-button-icon-container">
                                                        <FontAwesomeIcon className="play-button-icon" icon={faCirclePlay} />
                                                    </div>
                                                    <span className="ms-3 text-white fs-4 fw-bold text-uppercase" style={{textShadow: '2px 2px 4px #000'}}>
                                                        REVIEW
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </Carousel>
        </div>
    )
}

export default Hero