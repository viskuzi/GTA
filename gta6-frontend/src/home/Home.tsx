import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./Home.module.css";
import { useState } from "react";

interface IFormState {
  name: string;
  email: string;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopCallStackFor3Seconds() {
  console.log("Call stack stopped for 3 seconds...");
  await delay(3000);
  console.log("Call stack resumed.");
}

function Home() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormState>();

  const onSubmit: SubmitHandler<IFormState> = async (data) => {
    setIsLoading(true);
    await stopCallStackFor3Seconds();
    fetch("http://localhost:5000/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          throw new Error("Bad response");
        }

        setIsSuccess(true);
        reset();
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  console.log(isLoading);

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSuccess && !isLoading ? (
          <p className={styles.success}>Form sent!</p>
        ) : (
          <>
            <h1>GTA 6 - Apply</h1>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter email"
              className={`${errors.email ? styles["input-error"] : ""}`}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Enter name"
              className={`${errors.name ? styles["input-error"] : ""}`}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Order game!"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Home;
