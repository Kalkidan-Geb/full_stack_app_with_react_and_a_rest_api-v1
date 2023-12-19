import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';

import {UserContext} from '../context/UserContext.js';
import ErrorsDisplay from './ErrorsDisplay.js';

const CourseDetail = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // State for storing course details and validation errors
  const [course, setCourse] = useState({});
  const [errors, setErrors] = useState([]);

  // Effect hook to fetch the course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await response.json();

        // If course is not found, navigate to notfound route
        if (response.status === 404) {
          navigate('/notfound');
        } else {
          setCourse(data);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  // Function to handle course deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
      });

      // If the deletion is successful, navigate to the homepage
      if (response.status === 204) {
        navigate('/');
      } else if (response.status === 403) {
        // If user is not authorized to delete, navigate to forbidden route
        navigate('/forbidden');
      } else if (response.status === 404) {
        // If the course is not found, navigate to notfound route
        navigate('/notfound');
      } else {
        // If an unexpected error occurs, navigate to the error route
        navigate('/error');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            {user && user.id === course.userId && (
              <span>
                <Link className="button" to={`/courses/${id}/update`}>
                  Update Course
                </Link>
                <button className="button" onClick={handleDelete}>
                  Delete Course
                </button>
              </span>
            )}
            <Link className="button button-secondary" to="/">
              Return to List
            </Link>
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
            <p>
              By {course.user ? `${course.user.firstName} ${course.user.lastName}` : 'Unknown User'}
            </p>
          </div>
          <div className="course--description">
            <p>{course.description}</p>
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <h3>{course.estimatedTime || 'N/A'}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  <p>{course.materialsNeeded || 'N/A'}</p>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;