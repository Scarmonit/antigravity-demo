import React from 'react';

const FirebaseCard: React.FC = React.memo(() => {
  return (
    <div className="info-card">
      <h2>🔥 Firebase Integration</h2>
      <div className="firebase-showcase">
        <div className="firebase-feature">
          <h3>📱 Connected Apps</h3>
          <p>iOS, Android, Web platforms ready</p>
        </div>
        <div className="firebase-feature">
          <h3>🗄️ Firestore</h3>
          <p>Real-time database integration</p>
        </div>
        <div className="firebase-feature">
          <h3>🔐 Authentication</h3>
          <p>Multiple auth providers supported</p>
        </div>
        <div className="firebase-feature">
          <h3>☁️ Cloud Functions</h3>
          <p>Serverless backend ready</p>
        </div>
      </div>
    </div>
  );
});

export default FirebaseCard;
