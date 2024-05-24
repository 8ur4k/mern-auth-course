import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import { Spinner } from "react-bootstrap";

interface ProfilePageProps {
  profileUsername: string | undefined;
}

const ProfilePage = ({ profileUsername }: ProfilePageProps) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileLoadingError, setShowProfileLoadingError] = useState(false);

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
  }, [profileUsername]);

  return (
    <div>
      {profileLoading && <Spinner animation="border" variant="primary" />}
      {showProfileLoadingError && <h5>User Not Found 404</h5>}
      {!profileLoading && (
        <>
          <p>{profileUser?.username}</p>
          <p>{profileUser?.email}</p>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
