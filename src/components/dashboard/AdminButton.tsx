import { motion } from 'framer-motion'
import { NavigateProps } from '../../types';
const AdminButton = ({ Icon, direction, onClick }: NavigateProps) => {
    return (
        <main className="h-0 w-0">
            {/* <motion.button className={`bg-slate-400 text-white dark:bg-gray-light shadow-xl h-fit w-fit rounded-full relative flex justify-center items-center p-2 top-[205px] z-10
            ${direction === 'right' ? '-right-0' : '-left-12'}`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                onClick={onClick}
            >
                <Icon size={30} />
            </motion.button> */}
            <motion.button
                initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                Add Course
                <Icon size={45} />
            </motion.button>
        </main>
    )
}
export default AdminButton;