from mip_solver import Solver


class SampleModel:
    def __init__(self):
        self.solver = Solver(Solver.CBC, self.bound, self.solution)
        self.x = self.solver.addInteger('x', lower_bound=0., upper_bound=None)
        self.y = self.solver.addInteger('y', lower_bound=0., upper_bound=None)

        self.solver.addCondition(self.x + 7 * self.y <= 17.5)
        self.solver.addCondition(self.x <= 3.5)
        self.solver.addCondition(self.x >= 0)
        self.solver.addCondition(self.y >= 0)

    def bound(self, bound):
        print('%.4f' % bound)

    def solution(self, solution):
        print('%.4f\tx = %d\ty = %d' % (
            solution.objective(),
            solution.value(self.x),
            solution.value(self.y)))

    def solve(self):
        self.solver.maximize(self.x + 10 * self.y)


def main():
    model = SampleModel()
    model.solve()
