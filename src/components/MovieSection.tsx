import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

/** Represents a single available video file (quality, type and URL). */
interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

/** Represents a video item returned by the API. */
interface Video {
  id: number;
  image: string;
  video_files: VideoFile[];
  user: {
    id: number;
    name: string;
    url: string;
  };
  duration: number;
}

/** Props accepted by the MovieSection component. */
type Props = {
  /** Section title, used to determine the search query. */
  title: string;

  /** Array of favorite video IDs provided by the parent component. */
  favorites: number[];

  /**
   * Parent function that handles adding/removing a favorite.
   * @param videoId - ID of the selected video
   * @param video - Video object
   */
  onToggleFavorite: (videoId: number, video: Video) => Promise<void>;
};

/**
 * MovieSection Component
 *
 * Displays a horizontal section of videos based on a search query or popularity.
 * Includes skeleton loaders, hover-play previews, modal playback,
 * and favorite management synced with the parent component.
 */
export default function MovieSection({
  title,
  favorites,
  onToggleFavorite,
}: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<number | null>(null);

  /**
   * Maps section titles to predefined search queries.
   * @param sectionTitle - Title of the section
   * @returns A query string used for API requests
   */
  const getSearchQuery = (sectionTitle: string): string => {
    const queryMap: { [key: string]: string } = {
      "Recomendadas para ti": "nature",
      "Más populares": "popular",
      "Nuevos lanzamientos": "technology",
      "Series destacadas": "ocean",
    };
    return queryMap[sectionTitle] || "nature";
  };

  /**
   * Fetches videos based on the section title (search or popular).
   */
  useEffect(() => {
    async function fetchVideos() {
      const query = getSearchQuery(title);

      const endpoint =
        title === "Más populares"
          ? "/videos/popular"
          : `/videos/search?query=${encodeURIComponent(query)}`;

      const url = `${import.meta.env.VITE_API_URL}/api${endpoint}`;

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        setVideos((result.videos || []).slice(0, 6));
      } catch (error: any) {
        setError(`Error loading videos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideos();
  }, [title]);

  /**
   * Returns the best available video quality link.
   * Prefers HD if available.
   */
  const getBestVideoQuality = (videoFiles: VideoFile[]): string => {
    const hdVideo = videoFiles.find((file) => file.quality === "hd");
    return hdVideo ? hdVideo.link : videoFiles[0]?.link || "";
  };

  /** Opens the video modal. */
  const handleVideoClick = (video: Video) => setSelectedVideo(video);

  /** Closes the video modal. */
  const closeModal = () => setSelectedVideo(null);

  /**
   * Handles adding/removing favorites.
   * Prevents multiple clicks and shows loading state.
   */
  const handleToggleFavorite = async (
    e: React.MouseEvent,
    videoId: number,
    video: Video
  ) => {
    e.stopPropagation();

    if (isTogglingFavorite === videoId) return;

    setIsTogglingFavorite(videoId);
    try {
      await onToggleFavorite(videoId, video);
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setIsTogglingFavorite(null);
    }
  };

  /** Checks if a video is already in the favorites list. */
  const isFavorite = (videoId: number) => favorites.includes(videoId);

  const placeholders = new Array(6).fill(null);

  return (
    <>
      <section className="px-8 py-6">
        <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {/* Skeleton loaders */}
          {isLoading
            ? placeholders.map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
                />
              ))
            : videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group relative bg-gray-900"
                >
                  {/* Hover preview video */}
                  <video
                    poster={video.image}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    src={getBestVideoQuality(video.video_files)}
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                    {video.duration}s
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={(e) =>
                      handleToggleFavorite(e, video.id, video)
                    }
                    disabled={isTogglingFavorite === video.id}
                    className={`absolute top-2 right-2 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all z-10 group ${
                      isTogglingFavorite === video.id
                        ? "cursor-wait opacity-70"
                        : ""
                    }`}
                    aria-label={
                      isFavorite(video.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      size={20}
                      className={`transition-colors ${
                        isFavorite(video.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white hover:text-red-500"
                      } ${
                        isTogglingFavorite === video.id
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
        </div>
      </section>

      {/* Video modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-8"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10 group"
            >
              ✕
            </button>

            {/* Video player */}
            <video
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-lg shadow-2xl object-contain bg-black"
              src={getBestVideoQuality(selectedVideo.video_files)}
            />

            <div className="mt-4 text-white flex justify-between items-center">
              <div>
                <p className="text-lg">
                  <span className="font-semibold">Created by:</span>{" "}
                  {selectedVideo.user.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Duration: {selectedVideo.duration} seconds
                </p>
              </div>

              {/* Favorite button in modal */}
              <button
                onClick={(e) =>
                  handleToggleFavorite(e, selectedVideo.id, selectedVideo)
                }
                disabled={isTogglingFavorite === selectedVideo.id}
                className={`p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all relative group ${
                  isTogglingFavorite === selectedVideo.id
                    ? "cursor-wait opacity-70"
                    : ""
                }`}
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isFavorite(selectedVideo.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white hover:text-red-500"
                  } ${
                    isTogglingFavorite === selectedVideo.id
                      ? "animate-pulse"
                      : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
