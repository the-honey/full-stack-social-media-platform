import Posts from '@/components/Posts';
import Share from '@/components/Share';
import { QueryClientProvider } from '@tanstack/react-query';

const Home = () => {
  return (
    <div className="p-3 md:p-5 lg:py-5 lg:px-16 min-w-full">
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
