import { NavLink } from "react-router-dom"
import Footer from "../assets/components/footer/Footer"

export default function Home() {
  return (
    <>
        {/* En-tête */}
        <div className='bloc-titre flex gap-4 items-center justify-center h-[500px] pt-[50px] max-xl:h-[350px] max-md:h-[200px]'>

            <div className='w-3/6 min-w-[650px] max-md:min-w-screen max-md:px-[40px]'>
                <h1 className='font-bold text-5xl my-2 text-pink-400 max-lg:text-4xl max-md:text-3xl max-sm:text-xl'>Problème d'affectation</h1>
                <p className='font-thin max-sm:text-sm'>Cette application fournit une interface dediée au résolution de problème d'affectation. Soyez-en sur du résultat que vous donne l'application pour affecter vos tâches à des agents afin d'obtenir des coûts minimals et ainsi éviter des gros dépenses.</p>
            </div>

            <div className='h-full w-1/3 bg-white flex justify-center items-center border-2 border-pink-400 max-xl:hidden' style={{borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', overflow: 'hidden'}}>
                <img src="./images/aff.png" alt="" style={{}}/>
            </div>
        </div>

        {/* Fonctionnalités */}
        <div className='w-4/5 mt-[40px] mx-auto'>
            <p className='text-center text-3xl font-semibold text-pink-400 my-4 max-md:text-2xl'>Fonctionnalités</p>

            <div className="flex justify-center items-center flex-wrap gap-4">

                <div className='w-[450px] min-w-[310px] bg-white rounded-[25px] flex items-center gap-4 py-4 px-6'>
                    <div className='bg-pink-200 w-[70px] h-[70px] rounded-[15px] flex justify-center items-center text-white'>
                        <span className="icon text-4xl">
                            <i className="fas fa-cogs"></i>
                        </span>
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-xl max-md:text-lg max-sm:text-sm'>Optimisation automatique</p>
                        <p className="text-sm max-sm:text-xs">L'application optimise automatiquement l'affectation des tâches pour minimiser les coûts et maximiser l'efficivife.</p>
                    </div>
                </div>

                <div className='w-[450px] min-w-[310px] bg-white rounded-[25px] flex items-center gap-4 py-4 px-6'>
                    <div className='bg-pink-200 w-[70px] h-[70px] rounded-[15px] flex justify-center items-center text-white'>
                        <span className="icon text-4xl">
                            <i className="fas fa-gamepad"></i>
                        </span>
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-xl max-md:text-lg max-sm:text-sm'>Avoir un contrôle total</p>
                        <p className="text-sm max-sm:text-xs">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit ea sed ipsa atque, omnis unde!
                        </p>
                    </div>
                </div>

                <div className='w-[450px] min-w-[310px] bg-white rounded-[25px] flex items-center gap-4 py-4 px-6'>
                    <div className='bg-pink-200 w-[70px] h-[70px] rounded-[15px] flex justify-center items-center text-white'>
                        <span className="icon text-4xl">
                            <i className="fas fa-desktop"></i>
                        </span>
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-xl max-md:text-lg max-sm:text-sm'>Interface intuitive</p>
                        <p className="text-sm max-sm:text-xs">
                            Interface convinise et facile à utiliser, idéale même pour les internautes débutants.
                        </p>
                    </div>
                </div>

                <div className='w-[450px] min-w-[310px] bg-white rounded-[25px] flex items-center gap-4 py-4 px-6'>
                    <div className='bg-pink-200 w-[70px] h-[70px] rounded-[15px] flex justify-center items-center text-white'>
                        <span className="icon text-4xl">
                            <i className="fas fa-clock"></i>
                        </span>
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-xl max-md:text-lg max-sm:text-sm'>Gain de temps</p>
                        <p className="text-sm max-sm:text-xs">
                            Economisez un temps précieux en laissant l'application faire tout le travail pour vous.
                        </p>
                    </div>
                </div>

            </div>
            
        </div>

        {/* Comment ça marche */}
        <div className='mt-[40px]'>
            <p className='text-center text-3xl font-semibold text-pink-400 my-4 max-md:text-2xl'>Comment ça marche ?</p>
            <div className='w-2/3 min-w-[310px] mx-auto'>
                <img src="./images/fonctionnement.png" alt="" className='w-full rounded-[20px]'/>
            </div>

        </div>

        {/* Navigation */}
        <div className="mt-[40px]">
            <p className='font-semibold text-2xl text-center my-2 max-md:text-2xl'>Prêt à optimiser vos affectations ?</p>
            <p className='text-center mb-6 px-2'>Commencez dès maintenant et minimiser ou maximiser vos coûts</p>
            <div className='flex justify-center'>
                <NavLink to='/affectation' className='bg-pink-400 text-white px-8 py-2 rounded-xl cursor-pointer duration-150 ease-out hover:bg-pink-500'>Commencer</NavLink>
            </div>
        </div>

        {/* Footer */}
        <Footer />
    </>
  )
}
