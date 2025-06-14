import sytles from "./styles.module.scss";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import ResultItem from "../ResultItem";
import ResultBee from "../ResultBee";
import ResultMole from "../ResultMole";
import { DailyActivity } from "../../types/DatabaseTypes";
import { ACTIVITY_TYPES } from "../../constants/activityTypes";
import ResuletGround from "../ResultGround";

type Props = {
  displayData: { data: []; date: Date }; // displayDataの型を適切に定義する
};

const Result: React.FC<Props> = ({ displayData }) => {
  const grassModel = useGLTF("/model/grass.glb"); // モデルを読み込む
  const sunflowerModel = useGLTF("/model/sunflower.glb");
  const treeModel = useGLTF("/model/tree.glb"); // 追加のモデルを読み込む
  const models = [sunflowerModel, grassModel, treeModel]; // モデルの配列

  return (
    <>
      <div className={sytles.result}>
        <Canvas
          orthographic
          camera={{
            zoom: 45,
            position: [4, 6, 4],
            near: 0.1,
            far: 200,
          }}
          style={{
            backgroundColor: "#87593D",
          }}
          dpr={window.devicePixelRatio}
          shadows={"soft"}
        >
          <RotatingCamera />
          <OrbitControls
            enableZoom={true}
            enableRotate={false}
            enablePan={false}
            minZoom={20}
            maxZoom={45}
          />
          <ResuletGround />
          <Suspense fallback={null}>
            {displayData && (
              <ResultItems
                key={displayData.date.toISOString()} // displayData.dateの変更を検知して再レンダリング
                displayData={displayData}
                models={models} // モデルを渡す
              />
            )}
            {displayData && displayData.data.length > 20 && <ResultBee />}
            {displayData && displayData.data.length > 30 && <ResultMole />}
          </Suspense>

          <ambientLight intensity={1} />
          <directionalLight
            color={"#FDF8E8"}
            intensity={3}
            position={[2, 7, 2]}
            castShadow
          />
          <pointLight
            color={"#FDF8E8"}
            intensity={25}
            position={[2, 4, 2]}
            castShadow
          />
        </Canvas>
      </div>
    </>
  );
};

const RotatingCamera = () => {
  useFrame(({ camera }) => {
    const time = performance.now() * 0.0001; // 時間を基準に回転
    camera.position.x = Math.sin(time) * 10; // x軸を回転
    camera.position.z = Math.cos(time) * 10; // z軸を回転
    camera.lookAt(0, 0, 0); // 常に原点を向く
  });

  return null;
};

const formatData = (data: DailyActivity[]) => {
  const formattedData: { [key: string]: DailyActivity[] } = {};
  data.forEach((item: DailyActivity) => {
    if (typeof item.date === "string") {
      if (formattedData[item.date]) {
        formattedData[item.date].push(item);
      } else {
        formattedData[item.date] = [item];
      }
    }
  });
  return formattedData;
};

const getDateForMonthLength = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate(); // 月の最終日を取得
};

const getDataByDay = (itemCount: number[], displayData: any) => {
  // displayData.dateをYYYY-MM形式の文字列に変換
  const year = displayData.date.getFullYear();
  const month = (displayData.date.getMonth() + 1).toString().padStart(2, "0");
  const monthString = `${year}-${month}`;
  const datas = formatData(displayData.data);

  return itemCount.map((index) => {
    const day = (index + 1).toString().padStart(2, "0"); // 日付を2桁にフォーマット
    const key = `${monthString}-${day}`; // YYYY-MM-DD形式のキーを作成
    if (!datas[key]) {
      return []; // データがない場合は空の配列を設定
    } else {
      return datas[key];
    }
  });
};

const ResultItems = ({ displayData, models }: any) => {
  const dateLength = getDateForMonthLength(displayData.date);

  const itemCount = Array.from({ length: dateLength - 1 }, (_, index) => index);
  const planeSize = 10;
  const columns = 7; // 1行に配置するアイテム数
  const rows = Math.ceil(itemCount.length / columns); // 必要な行数
  const spacingX = planeSize / columns; // x方向の間隔
  const spacingZ = (planeSize + 2) / rows; // z方向の間隔
  const datas = getDataByDay(itemCount, displayData); // 月の日付を取得

  const getModel = (data: any) => {
    let model = models[0];

    if (data[0] && data[0].activity_type === ACTIVITY_TYPES[0].type) {
      model = models[0];
    } else if (data[0] && data[0].activity_type === ACTIVITY_TYPES[1].type) {
      model = models[1];
    } else if (data[0] && data[0].activity_type === ACTIVITY_TYPES[2].type) {
      model = models[2];
    }

    return {
      scene: model.scene.clone(),
      animations: model.animations.map((anim: any) => anim.clone()),
    };
  };

  return (
    <>
      {datas.map((data, index) => {
        const row = Math.floor(index / columns); // 行番号
        const col = index % columns; // 列番号
        const isEven = index % 2 === 0; // 偶数インデックスかどうか
        const { scene, animations } = getModel(data);
        // x, z の位置を計算 (-planeSize / 2 から planeSize / 2 の範囲内に配置)
        const x = col * spacingX - planeSize / 2 + spacingX / 2;
        const z =
          row * spacingZ -
          planeSize / 2 +
          spacingZ / 2 +
          (isEven ? 0.25 : -0.25);
        return (
          data.length > 0 && ( // データが存在する場合のみレンダリング
            <ResultItem
              key={`result-item-${index}`} // 一意なキー
              position={[x, -0.05, z]} // 計算した位置
              displayFrameNumber={data.length * 20} // 表示するフレーム数
              scene={scene} // シーンを複製
              animations={animations} // アニメーションを複製
            />
          )
        );
      })}
    </>
  );
};

export default Result;
