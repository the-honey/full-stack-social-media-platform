import Posts from '@/components/Posts';
import { QueryClientProvider } from '@tanstack/react-query';

const Home = () => {
  return (
    <div className="p-3 md:p-5 lg:py-5 lg:px-16 min-w-full">
      <Posts />
    </div>
  );
};

export default Home;
