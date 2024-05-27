import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import createHttpError from "http-errors";
import { Spinner } from "react-bootstrap";
import styles from "../styles/ProfilePage.module.css";
import ProfileAuthCard from "../components/LoggedInUserProfileCard";
import ProfileCard from "../components/ProfileCard";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [profileUser, setProfileUser] = useState<User>();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoadingError, setProfileLoadingError] = useState<String>("");
  const [isLoggedInUserProfile, setIsLoggedInUserProfile] =
    useState<Boolean>(false);
  const profileUsername = useParams().username;

  useEffect(() => {
    async function setUser() {
      try {
        setProfileLoading(true);
        setProfileLoadingError("");

        if (!profileUsername) {
          throw createHttpError(400, "Invalid parameters");
        }

        const authUser = await UserApi.getLoggedInUser();
        const paramUser = await UserApi.getUser({
          profileUsername,
        });

        if (authUser.username === paramUser.username) {
          setProfileUser(authUser);
          setIsLoggedInUserProfile(true);
        } else {
          setProfileUser(paramUser);
        }
      } catch (error) {
        setProfileLoadingError("User not found 404");
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    }
    setUser();
  }, [profileUsername]);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.center}>
        {profileLoading ? (
          <div>
            <Spinner variant="primary" />
          </div>
        ) : !profileLoadingError ? (
          isLoggedInUserProfile ? (
            <div>
              <ProfileAuthCard
                username={profileUser!.username!}
                email={profileUser!.email}
              />
            </div>
          ) : (
            <div>
              <ProfileCard username={profileUser?.username!} />
            </div>
          )
        ) : (
          <h5>{profileLoadingError}</h5>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
