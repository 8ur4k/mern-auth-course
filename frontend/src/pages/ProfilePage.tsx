import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import { Spinner } from "react-bootstrap";
import styles from "../styles/ProfilePage.module.css";
import ProfileAuthCard from "../components/ProfileAuthCard";
import ProfileCard from "../components/ProfileCard";

interface ProfilePageProps {
  profileUsername: string | undefined;
}

const ProfilePage = ({ profileUsername }: ProfilePageProps) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileLoadingError, setShowProfileLoadingError] = useState(false);
  const [isProfileAuth, setIsProfileAuth] = useState(false);

  useEffect(() => {
    async function getProfileUser() {
      try {
        setShowProfileLoadingError(false);
        setProfileLoading(true);
        if (profileUsername) {
          const user = await UserApi.getUser({
            profileUsername: profileUsername,
          });
          setProfileUser(user);
        } else {
          console.error(404, "User Not Found");
        }
      } catch (error) {
        setShowProfileLoadingError(true);
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    }
    getProfileUser();
    if (profileUser?.email) {
      setIsProfileAuth(true);
    }
  }, [profileUsername, profileUser?.email]);

  return (
    <div className={styles.profileContainer}>
      {profileLoading && (
        <div className={styles.center}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {showProfileLoadingError && (
        <h5 className={styles.center}>User Not Found 404</h5>
      )}
      {!profileLoading &&
        !showProfileLoadingError &&
        (isProfileAuth ? (
          <div className={styles.center}>
            <ProfileAuthCard
              username={profileUser?.username!}
              email={profileUser?.email}
            />
          </div>
        ) : (
          <div className={styles.center}>
            <ProfileCard username={profileUser?.username!} />
          </div>
        ))}
    </div>
  );
};

export default ProfilePage;
