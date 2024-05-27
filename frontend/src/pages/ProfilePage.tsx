import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import { Spinner } from "react-bootstrap";
import styles from "../styles/ProfilePage.module.css";
import ProfileAuthCard from "../components/ProfileAuthCard";
import ProfileCard from "../components/ProfileCard";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [profileUser, setProfileUser] = useState<User>();
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileLoadingError, setShowProfileLoadingError] = useState(false);
  const [isProfileAuth, setIsProfileAuth] = useState<Boolean>(false);
  const profileUsername = useParams().username || "";

  useEffect(() => {
    async function setUser() {
      try {
        setProfileLoading(true);
        setShowProfileLoadingError(false);

        const authUser = await UserApi.getLoggedInUser();
        const paramUser = await UserApi.getUser({
          profileUsername: profileUsername,
        });

        if (authUser.username === paramUser.username) {
          setProfileUser(authUser);
          setIsProfileAuth(true);
        } else {
          setProfileUser(paramUser);
        }
      } catch (error) {
        setShowProfileLoadingError(true);
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    }
    setUser();
  }, [profileUsername]);

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
