import React from 'react';

const ContestCard = ({ contest, isBookmarked, toggleBookmark, isPast }) => {
  const timeRemaining = new Date(contest.startTime) - Date.now();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return (
    <div className={`contest-card ${isPast ? 'past' : 'upcoming'}`}>
      <h3>{contest.name}</h3>
      <p>Platform: {contest.platform}</p>
      <p>Start Time: {new Date(contest.startTime).toLocaleString()}</p>
      <p>Duration: {contest.duration / 60} minutes</p>
      {isPast && contest.youtubeSolutionUrl && (
        <p>
          <a href={contest.youtubeSolutionUrl} target="_blank" rel="noopener noreferrer">
            View Solution
          </a>
        </p>
      )}
      {!isPast && (
        <p>Time Remaining: {daysRemaining} days, {hoursRemaining} hours</p>
      )}
      <button 
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={() => toggleBookmark(contest.id)}
      >
        <svg
          className="bookmark-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path
            fill={isBookmarked ? "#FFD700" : "none"}
            stroke={isBookmarked ? "#FFD700" : "currentColor"}
            strokeWidth="2"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
        <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      </button>
    </div>
  );
};

export default ContestCard;
