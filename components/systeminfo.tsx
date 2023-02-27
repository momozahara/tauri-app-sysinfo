import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export type SystemInfoType = {
  cpu_usages: string[];
};

export default function SystemInfo() {
  const [sys, setSys] = useState<SystemInfoType>();

  useEffect(() => {
    invoke("get_sys").then((response) => {
      let data = JSON.parse(response as string);
      setSys(data);
    });
    const interval = setInterval(() => {
      invoke("get_sys").then((response) => {
        let data = JSON.parse(response as string);
        setSys(data);
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-8 pt-4">
      <div>
        <h1 className="text-xl font-bold">CPU</h1>
        <div>
          {sys ? (
            sys.cpu_usages.map((item, index) => {
              return (
                <p key={index}>
                  <span className="inline-block w-[32px] text-end">
                    {index + 1}:
                  </span>
                  <span className="inline-block ml-8 text-lg font-bold">
                    {item} <span className="text-base font-normal">%</span>
                  </span>
                </p>
              );
            })
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
    </div>
  );
}
