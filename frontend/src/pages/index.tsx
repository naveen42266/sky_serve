import Header from '@/components/header';
import MapWithDraw from '@/components/map/mapboxMap';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import React, { useEffect, useState } from 'react';
import { useUserDetails } from '@/context/userDetails';
import { toast, ToastContainer } from "react-toastify";
import { useCoordinatesDetails } from '@/context/coordinatesDetails';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { addCoordinate, getAllCoordinate } from '@/services/coordinates';
import { v4 as uuidv4 } from 'uuid';
import Drawer from '@mui/material/Drawer';

interface MeasurementInfo {
  distance?: number;
  area?: number;
}

interface DecodedToken {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  type: string;
}

const Home = () => {
  const router = useRouter();
  const { user, updateUser } = useUserDetails();
  const { coordinates, updateCoordinates } = useCoordinatesDetails();
  const [measurementInfo, setMeasurementInfo] = useState<MeasurementInfo>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coordinatesData, setCoordinatesData] = useState<any>([]);
  const [viewCoordinates, setViewCoordinates] = useState<any>(null);


  const token = router.query.token as string;

  const generateUUID = () => {
    return uuidv4(); // Generates a unique UUID
  };

  const handleAddCoordinate = async () => {
    if (user) {
      console.log("Coordinates:", coordinates); // Log coordinates to verify the structure
      const payload = {
        measurementId: generateUUID(), // Replace with dynamic value
        coordinates: coordinates?.Coordinates, // Ensure coordinates exist
        isClosedShape: true,
        distance: coordinates?.distance ?? 0, // Example distance in kilometers
        area: coordinates?.area ?? 0, // Example area in square kilometers (optional)
        userId: user?.userId, // Replace with dynamic value
      };

      // Check if coordinates and Coordinates are defined
      if (!coordinates?.Coordinates || coordinates.Coordinates.length === 0) {
        toast.error('Coordinates data is missing or empty', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      try {
        const response = await addCoordinate(payload);
        if (response.message === 'Coordinate saved successfully') {
          toast.success(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          updateCoordinates(null)
        }
      } catch (err) {
        console.error("Error adding coordinate:", err);
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    } else {
      toast.error('Please login to save', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userData = {
          userId: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          profilePicture: decoded.profilePicture,
          type: decoded.type,
        };
        updateUser(userData);
        toast.success('User logged in successfully', { position: "top-right" });
        localStorage.setItem("authToken", token);
        router.replace("/");
      } catch (error) {
        toast.error('Invalid token. Please log in again.', { position: "top-right" });
      }
    }
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const newsData = localStorage.getItem('news');
    if (token) {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
      }
      else if (!newsData) {
        // getAllNewsApi();
      }
    }
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage) {
      toast.success('User logged in successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      localStorage.removeItem("loginMessage");
    }
  }, [])

  useEffect(() => {
    const getAllCoordinates = async (id: string) => {
      try {
        const response = await getAllCoordinate(id);
        console.log(response.data, "response")
        if (response.success) {
          setCoordinatesData(response.data)
        }
      } catch (err) {
        console.error("Error adding coordinate:", err);
      }
    }

    if (user?.userId) {
      getAllCoordinates(user.userId);
    }
  }, [user?.userId]);

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <ToastContainer />
      {/* <header className='sticky top-0 left-0 right-0 z-10'>
        <Header setOpen={(value: boolean) => { router.push(`/user/${user?.userId}`) }} />
      </header> */}
      <div className='flex justify-start h-full w-full relative'>
        <div className='p-4'>
          {isDialogOpen ? (
            <>
              <Drawer
                anchor="left"
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                BackdropProps={{
                  style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                }}
              >
                <div className="p-4 w-64">
                  <div className="flex justify-between items-center">
                    <div className='text-xl font-semibold'>Lists</div>
                    <CloseIcon
                      tabIndex={0}
                      aria-label="Close Dialog"
                      onClick={() => setIsDialogOpen(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsDialogOpen(false)}
                    />
                  </div>
                  <div>
                    {coordinatesData.map((coordinate: any, index: number) => (
                      <div key={coordinate.measurementId} className="mb-2">
                        <div>Measurement {index + 1}</div>
                        <div>Distance: {coordinate.distance} km</div>
                        <div>Area: {coordinate.area} km²</div>
                        <div className='flex justify-start items-center space-x-1'>
                          <button
                            onClick={() => {
                              setViewCoordinates(coordinate)
                              setIsDialogOpen(false)
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              // setViewCoordinates(coordinate)
                            }}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </Drawer>
            </>
          ) : (
            <div className="">
              <MenuIcon
                tabIndex={0}
                aria-label="Open Dialog"
                onClick={() => setIsDialogOpen(!isDialogOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setIsDialogOpen(!isDialogOpen)}
              />
            </div>
          )}
        </div>

        <MapWithDraw
          handleMeasurement={(key: boolean, value: MeasurementInfo) => {

          }}
        />
      </div>

      {coordinates && (
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center justify-end z-50">
          <div className="bg-white rounded p-2 w-64 shadow-lg text-xs">
            <div className='flex justify-between items-center'>
              <div>Measure distance</div>
              <CloseIcon fontSize='small' onClick={() => { localStorage.removeItem('coordinates'), updateCoordinates(null) }} />
            </div>
            <div className='text-slate-600'>Click on the map to add to your path</div>
            {coordinates?.distance && (
              <p>Distance: {coordinates?.distance} km</p>
            )}
            {coordinates?.area && <p>Area: {coordinates?.area} km²</p>}
            <div className='flex justify-start items-center space-x-1'>
              <button
                onClick={() => { localStorage.removeItem('coordinates'), updateCoordinates(null) }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
              <button
                onClick={() => { handleAddCoordinate() }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {viewCoordinates != null && (
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center justify-end z-50">
          <div className="bg-white rounded p-2 w-64 shadow-lg text-xs">
            <div className='flex justify-between items-center'>
              <div>Measure distance</div>
              <CloseIcon fontSize='small' onClick={() => { setViewCoordinates(null)}} />
            </div>
            <div className='text-slate-600'>Click on the map to add to your path</div>
            {viewCoordinates?.distance && (
              <p>Distance: {viewCoordinates?.distance} km</p>
            )}
            {viewCoordinates?.area && <p>Area: {viewCoordinates?.area} km²</p>}
            <div className='flex justify-start items-center space-x-1'>
              <button
                onClick={() => {  setViewCoordinates(null)}}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
              {/* <button
                onClick={() => { handleAddCoordinate() }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
